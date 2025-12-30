require("dotenv").config();
const mongoose = require("mongoose");

const createAdmin = async () => {
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

        const existingAdmin = await Admin.findOne({ email: "sandalanithinkumar2@gmail.com" });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists!");
            await mongoose.connection.close();
            return;
        }

        await Admin.create({
            email: "sandalanithinkumar2@gmail.com",
            password: "Nithin@",
            role: "admin"
        });

        console.log("✅ Admin created successfully!");
        console.log("📧 Email: sandalanithinkumar2@gmail.com");
        console.log("🔑 Password: Nithin@");

        await mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createAdmin();
