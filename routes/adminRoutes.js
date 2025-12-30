const express = require("express");
const router = express.Router();
const { adminLogin, setupAdmin } = require("../controllers/adminController");

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/setup", setupAdmin);

module.exports = router;
