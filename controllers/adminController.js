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

module.exports = { adminLogin, setupAdmin };
