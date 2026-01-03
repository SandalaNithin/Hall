require("dotenv").config();
const sendEmail = require("./utils/emailService");

console.log("=== TESTING EMAIL FUNCTIONALITY ===\n");

// Test email sending
async function testEmail() {
    try {
        console.log("📧 Sending test email...");

        await sendEmail({
            name: "Lakshmi Function Hall",
            email: "test-recipient@example.com", // Replace with your test email
            recipient: 'user',
            subject: "🧪 Test Email - Lakshmi Function Hall",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #667eea;">Test Email</h1>
                    <p>This is a test email from your Lakshmi Function Hall backend.</p>
                    <p>If you receive this, your email service is working correctly! ✅</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">Sent from: ${process.env.EMAIL_USER}</p>
                </div>
            `
        });

        console.log("\n✅ SUCCESS! Email sent successfully!");
        console.log("Check the inbox of: test-recipient@example.com");

    } catch (error) {
        console.error("\n❌ ERROR sending email:");
        console.error("Error message:", error.message);
        console.error("\nPossible issues:");
        console.error("1. Gmail App Password might be incorrect");
        console.error("2. 2-Step Verification not enabled on Gmail");
        console.error("3. Less secure app access might be blocked");
        console.error("\nFull error:", error);
    }
}

testEmail();
