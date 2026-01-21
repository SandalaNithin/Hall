const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGridEmail() {
    console.log("🧪 Testing SendGrid Email Delivery...\n");

    console.log("📋 Configuration:");
    console.log("   API Key:", process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 10)}...` : "❌ NOT SET");
    console.log("   From Email:", process.env.SENDGRID_FROM_EMAIL || "❌ NOT SET");
    console.log("   From Name:", process.env.SENDGRID_FROM_NAME || "❌ NOT SET");
    console.log("   Admin Email:", process.env.ADMIN_EMAIL || "❌ NOT SET");
    console.log("");

    const message = {
        to: process.env.ADMIN_EMAIL,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME || "Lakshmi Function Hall"
        },
        subject: "🧪 SendGrid Test Email - Lakshmi Function Hall",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px;">
                <h1 style="color: white; margin: 0;">🧪 Test Email</h1>
            </div>
            <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #374151;">This is a test email from SendGrid.</p>
                <p style="font-size: 16px; color: #374151;">If you received this, your SendGrid configuration is working correctly!</p>
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="color: #065f46; margin: 0; font-size: 14px;">
                        ✅ <strong>Success!</strong> SendGrid is properly configured and delivering emails.
                    </p>
                </div>
                <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                    Sent at: ${new Date().toLocaleString()}<br>
                    <strong>Lakshmi Function Hall</strong>
                </p>
            </div>
        </div>
        `,
    };

    try {
        console.log("📧 Sending test email...");
        const response = await sgMail.send(message);

        console.log("\n✅ Email sent successfully!");
        console.log("   Status Code:", response[0].statusCode);
        console.log("   Message ID:", response[0].headers['x-message-id']);
        console.log("\n⚠️  IMPORTANT NOTES:");
        console.log("   1. Status 202 means SendGrid ACCEPTED the email");
        console.log("   2. This does NOT guarantee delivery to inbox");
        console.log("   3. Check your email inbox (including spam folder)");
        console.log("   4. If email doesn't arrive, verify sender in SendGrid:");
        console.log("      → Go to: https://app.sendgrid.com/settings/sender_auth");
        console.log("      → Verify your sender email:", process.env.SENDGRID_FROM_EMAIL);
        console.log("\n📬 Check your inbox at:", process.env.ADMIN_EMAIL);

    } catch (error) {
        console.error("\n❌ Email sending failed!");
        console.error("   Error:", error.message);

        if (error.response) {
            console.error("   Status Code:", error.response.statusCode);
            console.error("   Body:", JSON.stringify(error.response.body, null, 2));

            // Specific error handling
            if (error.response.statusCode === 403) {
                console.error("\n⚠️  ERROR 403: SENDER NOT VERIFIED");
                console.error("   → Your sender email is NOT verified in SendGrid");
                console.error("   → Go to: https://app.sendgrid.com/settings/sender_auth");
                console.error("   → Add and verify:", process.env.SENDGRID_FROM_EMAIL);
            } else if (error.response.statusCode === 401) {
                console.error("\n⚠️  ERROR 401: INVALID API KEY");
                console.error("   → Your SendGrid API key is invalid or expired");
                console.error("   → Generate new key at: https://app.sendgrid.com/settings/api_keys");
            }
        }
    }
}

// Run the test
testSendGridEmail();
