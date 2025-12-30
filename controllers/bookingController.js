const Booking = require("../models/Booking");
const sendEmail = require("../utils/emailService");
const bookingSchema = require("../validations/bookingSchema");
const fs = require("fs");

// @desc    Create new booking
// @route   POST /api/booking
// @access  Public
const createBooking = async (req, res) => {
    try {
        // 1. Zod Validation
        const validation = bookingSchema.safeParse(req.body);
        if (!validation.success) {
            const errorMessages = validation.error.issues.map((issue) => issue.message).join(", ");
            console.log("❌ Validation Error:", errorMessages);
            return res.status(400).json({ success: false, message: errorMessages });
        }

        const {
            name,
            email,
            phone,
            eventType,
            guests,
            fromDate,
            toDate,
            checkIn,
            checkOut,
            message,
        } = validation.data;

        const userIP = req.ip;

        // 2. EMAIL-BASED 24-HOUR RESTRICTION (Limit 1 booking per email every 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentBooking = await Booking.findOne({
            email: email.toLowerCase(),
            createdAt: { $gte: twentyFourHoursAgo },
        });

        if (recentBooking) {
            return res.status(429).json({
                success: false,
                message: "You can submit only once every 24 hours.",
            });
        }

        // 3. DATE RANGE OVERLAP VALIDATION
        // Convert date strings to Date objects for proper comparison
        const requestedFromDate = new Date(fromDate);
        const requestedToDate = new Date(toDate);

        // Check if requested date range overlaps with any confirmed booking
        // Overlap logic: requested_from_date <= existing_to_date AND requested_to_date >= existing_from_date
        const overlappingBooking = await Booking.findOne({
            status: "confirmed",
            fromDate: { $lte: requestedToDate },
            toDate: { $gte: requestedFromDate },
        });

        if (overlappingBooking) {
            return res.status(409).json({
                success: false,
                message: "These dates are already booked. Please choose different dates.",
            });
        }

        // 4. SAVE TO DB (as pending - admin will confirm later)
        const booking = await Booking.create({
            name,
            email: email.toLowerCase(),
            phone,
            eventType,
            guests,
            fromDate: requestedFromDate,
            toDate: requestedToDate,
            checkIn,
            checkOut,
            message,
            ip: userIP,
            status: "pending", // Changed from "confirmed"
        });

        console.log("✅ BOOKING REQUEST SAVED TO DB:", booking._id);

        // Email will be sent only when admin confirms the booking
        res.status(201).json({
            success: true,
            message: "Booking request submitted successfully! We'll contact you soon.",
            data: booking,
        });

    } catch (error) {
        console.error("❌ SERVER ERROR:", error);
        // Log error to file (simple logging mechanism)
        fs.appendFileSync("error.log", `${new Date().toISOString()} - ${error.stack}\n`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// @desc    Get all blocked dates (confirmed bookings)
// @route   GET /api/booking/blocked-dates
// @access  Public
const getBlockedDates = async (req, res) => {
    try {
        // Fetch all confirmed bookings
        const confirmedBookings = await Booking.find(
            { status: "confirmed" },
            { fromDate: 1, toDate: 1, _id: 0 }
        ).sort({ fromDate: 1 });

        // Format dates as ISO strings for frontend
        const blockedRanges = confirmedBookings.map(booking => ({
            fromDate: booking.fromDate.toISOString().split('T')[0],
            toDate: booking.toDate.toISOString().split('T')[0],
        }));

        res.status(200).json({
            success: true,
            data: blockedRanges,
        });

    } catch (error) {
        console.error("❌ ERROR FETCHING BLOCKED DATES:", error);
        res.status(500).json({ success: false, message: "Failed to fetch blocked dates" });
    }
};

// @desc    Confirm a pending booking (Admin only)
// @route   PATCH /api/booking/:id/confirm
// @access  Admin (TODO: Add authentication middleware)
const confirmBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot confirm booking with status: ${booking.status}`
            });
        }

        // Check for date overlap with other confirmed bookings
        const overlappingBooking = await Booking.findOne({
            _id: { $ne: id }, // Exclude current booking
            status: "confirmed",
            fromDate: { $lte: booking.toDate },
            toDate: { $gte: booking.fromDate },
        });

        if (overlappingBooking) {
            return res.status(409).json({
                success: false,
                message: "Cannot confirm: These dates are already booked by another confirmed booking."
            });
        }

        // Update booking status to confirmed
        booking.status = "confirmed";
        booking.confirmedAt = new Date();
        await booking.save();

        console.log("✅ BOOKING CONFIRMED:", booking._id);

        res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: booking
        });

    } catch (error) {
        console.error("❌ ERROR CONFIRMING BOOKING:", error);
        fs.appendFileSync("error.log", `${new Date().toISOString()} - ${error.stack}\n`);
        res.status(500).json({ success: false, message: "Failed to confirm booking" });
    }
};

// @desc    Reject a pending booking (Admin only)
// @route   PATCH /api/booking/:id/reject
// @access  Admin (TODO: Add authentication middleware)
const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body; // Get rejection reason from request

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject booking with status: ${booking.status}`
            });
        }

        booking.status = "rejected";
        booking.rejectionReason = reason || "The requested dates are not available for booking";
        booking.rejectedAt = new Date();
        await booking.save();

        console.log("✅ BOOKING REJECTED:", booking._id);

        // Send rejection email to user
        const rejectionEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Booking Request - Unable to Confirm</h2>
            <p>Dear ${booking.name},</p>
            <p>Thank you for your interest in Lakshmi Function Hall.</p>
            <p><strong>Unfortunately, we are unable to confirm your booking request.</strong></p>
            
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #991b1b;">Reason:</h3>
                <p style="margin: 5px 0; font-size: 16px;"><strong>${booking.rejectionReason}</strong></p>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #374151;">Your Booking Details:</h3>
                <p style="margin: 5px 0;"><strong>From:</strong> ${new Date(booking.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 5px 0;"><strong>To:</strong> ${new Date(booking.toDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 5px 0;"><strong>Event Type:</strong> ${booking.eventType}</p>
                <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${booking.phone}</p>
            </div>

            <p>We apologize for any inconvenience. Please feel free to contact us at <strong>${booking.phone}</strong> to check availability for alternative dates or discuss other options.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Lakshmi Function Hall Team</strong></p>
        </div>
      `;

        try {
            await sendEmail({
                name: "Lakshmi Function Hall",
                email: booking.email,
                recipient: 'user', // Send to user, not owner
                subject: "Booking Request - Unable to Confirm",
                html: rejectionEmailContent,
            });
            console.log("✅ REJECTION EMAIL SENT TO:", booking.email);
        } catch (emailError) {
            console.error("❌ ERROR SENDING REJECTION EMAIL:", emailError);
            // Continue even if email fails
        }

        res.status(200).json({
            success: true,
            message: "Booking rejected and user notified via email",
            data: booking
        });

    } catch (error) {
        console.error("❌ ERROR REJECTING BOOKING:", error);
        fs.appendFileSync("error.log", `${new Date().toISOString()} - ${error.stack}\n`);
        res.status(500).json({ success: false, message: "Failed to reject booking" });
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/booking/all?status=pending|confirmed|rejected
// @access  Admin (TODO: Add authentication middleware)
const getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;

        // Build filter
        const filter = {};
        if (status && ["pending", "confirmed", "rejected"].includes(status)) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error("❌ ERROR FETCHING BOOKINGS:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// @desc    Get pending bookings (Admin only)
// @route   GET /api/booking/pending
// @access  Admin (TODO: Add authentication middleware)
const getPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ status: "pending" })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingBookings.length,
            data: pendingBookings
        });

    } catch (error) {
        console.error("❌ ERROR FETCHING PENDING BOOKINGS:", error);
        res.status(500).json({ success: false, message: "Failed to fetch pending bookings" });
    }
};

module.exports = {
    createBooking,
    getBlockedDates,
    confirmBooking,
    rejectBooking,
    getAllBookings,
    getPendingBookings
};

