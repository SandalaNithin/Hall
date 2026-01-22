const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    resetOTP: {
        type: String
    },
    resetOTPExpires: {
        type: Date
    }
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt
    strict: true       // Ensure only schema fields are saved
});

module.exports = mongoose.model("Admin", adminSchema);
