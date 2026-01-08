require("dotenv").config();
const sendEmail = require("./utils/emailService");

console.log("=== EMAIL CONFIGURATION DIAGNOSTIC ===\n");

// Check environment variables
console.log("1. Checking Environment Variables:");
console.log("   EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ NOT SET");
console.log("   EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ NOT SET");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("\n❌ ERROR: Email credentials not configured!");
    console.error("\nPlease add the following to your .env file:");
    console.error("EMAIL_USER=your-email@gmail.com");
    console.error("EMAIL_PASS=your-app-password");
    console.error("\n📖 How to get Gmail App Password:");
    console.error("1. Go to Google Account settings");
    console.error("2. Enable 2-Step Verification");
    console.error("3. Go to Security > App passwords");
    console.error("4. Generate a new app password for 'Mail'");
    console.error("5. Copy the 16-character password to .env\n");
    process.exit(1);
}

// Test email sending
async function testBookingConfirmationEmail() {
    try {
        console.log("\n2. Testing Booking Confirmation Email:");
        console.log("   Sending to:", process.env.EMAIL_USER);

        const testBooking = {
            name: "Test User",
            email: process.env.EMAIL_USER, // Send to yourself for testing
            eventType: "Wedding",
            fromDate: new Date("2026-02-15"),
            toDate: new Date("2026-02-16"),
            checkIn: "10:00 AM",
            checkOut: "11:00 PM",
            guests: 200,
            phone: "+91 1234567890",
            message: "This is a test booking confirmation email"
        };

        const confirmationEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Booking Confirmed! (TEST)</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${testBooking.name}</strong>,</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Great news! Your booking request for <strong>Lakshmi Function Hall</strong> has been confirmed. We're excited to host your event!
                </p>

                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 5px;">
                    <h2 style="color: #065f46; margin-top: 0; font-size: 20px;">📋 Booking Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Event Type:</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${testBooking.eventType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">From Date:</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${new Date(testBooking.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">To Date:</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${new Date(testBooking.toDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Number of Guests:</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${testBooking.guests}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 14px; color: #dc2626; font-weight: bold;">⚠️ THIS IS A TEST EMAIL - No actual booking was made</p>
            </div>
        </div>
        `;

        await sendEmail({
            name: "Lakshmi Function Hall",
            email: testBooking.email,
            recipient: 'user',
            subject: "🧪 TEST: Booking Confirmation - Lakshmi Function Hall",
            html: confirmationEmailContent,
        });

        console.log("\n✅ SUCCESS! Test email sent successfully!");
        console.log("   Check your inbox:", process.env.EMAIL_USER);
        console.log("\n📧 If you received the email, your configuration is working correctly!");
        console.log("   If not, check:");
        console.log("   - Spam/Junk folder");
        console.log("   - Gmail App Password is correct");
        console.log("   - 2-Step Verification is enabled");

    } catch (error) {
        console.error("\n❌ ERROR sending test email:");
        console.error("   Message:", error.message);
        console.error("   Code:", error.code);

        console.error("\n🔧 Troubleshooting:");
        if (error.code === 'EAUTH') {
            console.error("   - Authentication failed. Check your EMAIL_PASS in .env");
            console.error("   - Make sure you're using an App Password, not your regular Gmail password");
        } else if (error.code === 'ECONNECTION') {
            console.error("   - Connection failed. Check your internet connection");
        } else {
            console.error("   - Unknown error. Full details:", error);
        }
    }
}

testBookingConfirmationEmail();
