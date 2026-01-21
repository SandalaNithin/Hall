const Admin = require("../models/Admin");

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password (plain text comparison - for simplicity)
        // In production, use bcrypt for hashed passwords
        if (admin.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Login successful
        console.log("✅ ADMIN LOGIN SUCCESSFUL:", admin.email);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("❌ ADMIN LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// @desc    Create initial admin (run once to setup)
// @route   POST /api/admin/setup
// @access  Public (should be protected in production)
const setupAdmin = async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: "sandalanithinkumar2@gmail.com" });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        // Create admin
        const admin = await Admin.create({
            email: "sandalanithinkumar2@gmail.com",
            password: "Nithin@",
            role: "admin"
        });

        console.log("✅ ADMIN CREATED:", admin.email);

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("❌ ADMIN SETUP ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create admin"
        });
    }
};

// @desc    Request password reset OTP
// @route   POST /api/admin/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "No admin account found with this email"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP expiration to 10 minutes from now
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to database
        admin.resetOTP = otp;
        admin.resetOTPExpires = otpExpires;
        await admin.save();

        console.log("✅ OTP SAVED TO DATABASE FOR:", admin.email);

        // Send response immediately to prevent timeout
        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please check your inbox."
        });

        // Send OTP via email asynchronously (non-blocking)
        const sendEmail = require("../utils/sendgridService");

        const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello Admin,</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    We received a request to reset your password for <strong>Lakshmi Function Hall Admin Panel</strong>.
                </p>

                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 5px; text-align: center;">
                    <p style="color: #065f46; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Your OTP Code:</p>
                    <p style="font-size: 36px; font-weight: bold; color: #059669; margin: 10px 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    <p style="color: #dc2626; margin: 10px 0 0 0; font-size: 14px;">⏰ Valid for 10 minutes</p>
                </div>

                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="color: #991b1b; margin: 0; font-size: 14px;">
                        <strong>⚠️ Security Notice:</strong><br>
                        • Do not share this OTP with anyone<br>
                        • If you didn't request this, please ignore this email<br>
                        • Your password will remain unchanged
                    </p>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                    Best regards,<br>
                    <strong>Lakshmi Function Hall Team</strong>
                </p>
            </div>
        </div>
        `;

        // Send email in background without blocking
        sendEmail({
            name: "Lakshmi Function Hall",
            email: admin.email,
            recipient: 'user',
            subject: "🔐 Password Reset OTP - Lakshmi Function Hall",
            html: emailContent,
        }).then(() => {
            console.log("✅ OTP EMAIL SENT TO:", admin.email);
        }).catch((error) => {
            console.error("❌ EMAIL SENDING FAILED FOR:", admin.email, error.message);
            // Email failed but user already got success response
            // OTP is still valid in database
        });

    } catch (error) {
        console.error("❌ FORGOT PASSWORD ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process request. Please try again."
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/admin/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Check if OTP exists
        if (!admin.resetOTP || !admin.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "No OTP request found. Please request a new OTP."
            });
        }

        // Check if OTP has expired
        if (new Date() > admin.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Verify OTP
        if (admin.resetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }

        console.log("✅ OTP VERIFIED FOR:", admin.email);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        });

    } catch (error) {
        console.error("❌ VERIFY OTP ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP. Please try again."
        });
    }
};

// @desc    Reset password
// @route   POST /api/admin/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and new password are required"
            });
        }

        // Validate password strength (optional)
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Check if OTP exists
        if (!admin.resetOTP || !admin.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "No OTP request found. Please request a new OTP."
            });
        }

        // Check if OTP has expired
        if (new Date() > admin.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Verify OTP
        if (admin.resetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }

        // Update password
        admin.password = newPassword;

        // Clear OTP fields
        admin.resetOTP = null;
        admin.resetOTPExpires = null;

        await admin.save();

        console.log("✅ PASSWORD RESET SUCCESSFUL FOR:", admin.email);

        res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login with your new password."
        });

    } catch (error) {
        console.error("❌ RESET PASSWORD ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again."
        });
    }
};

module.exports = { adminLogin, setupAdmin, forgotPassword, verifyOTP, resetPassword };
