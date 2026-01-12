const express = require("express");
const router = express.Router();
const { adminLogin, setupAdmin, forgotPassword, verifyOTP, resetPassword } = require("../controllers/adminController");

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/setup", setupAdmin);

// Forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
