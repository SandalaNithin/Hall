const express = require("express");
const router = express.Router();
const { adminLogin, setupAdmin, forgotPassword, verifyOTP, resetPassword, debugCheckOTP } = require("../controllers/adminController");

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/setup", setupAdmin);

// Forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Debug route (remove in production)
router.post("/debug-check-otp", debugCheckOTP);

module.exports = router;
