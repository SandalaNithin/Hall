require("dotenv").config();

console.log("=== EMAIL CONFIGURATION CHECK ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Configured" : "❌ NOT SET");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Configured" : "❌ NOT SET");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Configured" : "❌ NOT SET");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n⚠️  WARNING: Email credentials are missing!");
    console.log("Please add to your .env file:");
    console.log("EMAIL_USER=your-gmail@gmail.com");
    console.log("EMAIL_PASS=your-app-password");
} else {
    console.log("\n✅ Email configuration looks good!");
    console.log("Email will be sent from:", process.env.EMAIL_USER);
}
