const express = require("express");
const router = express.Router();
const {
    createBooking,
    getBlockedDates,
    confirmBooking,
    rejectBooking,
    getAllBookings,
    getPendingBookings
} = require("../controllers/bookingController");

// Public routes
router.post("/", createBooking);
router.get("/blocked-dates", getBlockedDates);

// Admin routes (TODO: Add authentication middleware)
router.get("/all", getAllBookings);
router.get("/pending", getPendingBookings);
router.patch("/:id/confirm", confirmBooking);
router.patch("/:id/reject", rejectBooking);

module.exports = router;

