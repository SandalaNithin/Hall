// Delete and recreate admin account
require("dotenv").config();
const mongoose = require("mongoose");

const fixAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const adminSchema = new mongoose.Schema({
            email: String,
            password: String,
            role: String,
            createdAt: { type: Date, default: Date.now }
        });

        const Admin = mongoose.model("Admin", adminSchema);

        // Delete existing admin
        await Admin.deleteMany({ email: "sandalanithinkumar2@gmail.com" });
        console.log("🗑️ Deleted existing admin");

        // Create new admin
        await Admin.create({
            email: "sandalanithinkumar2@gmail.com",
            password: "Nithin@",
            role: "admin"
        });

        console.log("✅ Admin created successfully!");
        console.log("📧 Email: sandalanithinkumar2@gmail.com");
        console.log("🔑 Password: Nithin@");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

fixAdmin();
