// Test SendGrid API directly
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log("\n🔍 ========== SENDGRID DIAGNOSTIC TEST ==========\n");

// Step 1: Check environment variables
console.log("Step 1: Checking Environment Variables...");
console.log("SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY);
console.log("SENDGRID_API_KEY starts with 'SG.':", process.env.SENDGRID_API_KEY?.startsWith('SG.'));
console.log("SENDGRID_API_KEY length:", process.env.SENDGRID_API_KEY?.length);
console.log("SENDGRID_FROM_EMAIL:", process.env.SENDGRID_FROM_EMAIL);
console.log("SENDGRID_FROM_NAME:", process.env.SENDGRID_FROM_NAME);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

// Step 2: Initialize SendGrid
console.log("\nStep 2: Initializing SendGrid...");
try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ SendGrid initialized");
} catch (error) {
    console.error("❌ Failed to initialize SendGrid:", error.message);
    process.exit(1);
}

// Step 3: Test sending email
console.log("\nStep 3: Attempting to send test email...");
const testEmail = {
    to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself for testing
    from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME || 'Lakshmi Function Hall'
    },
    subject: '🧪 SendGrid Test Email - ' + new Date().toISOString(),
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>✅ SendGrid Test Successful!</h2>
            <p>This is a test email from your Lakshmi Function Hall backend.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p>If you received this email, SendGrid is working correctly!</p>
        </div>
    `
};

console.log("Sending to:", testEmail.to);
console.log("From:", testEmail.from.email);
console.log("Subject:", testEmail.subject);

sgMail.send(testEmail)
    .then((response) => {
        console.log("\n✅ ========== EMAIL SENT SUCCESSFULLY! ==========");
        console.log("Status Code:", response[0].statusCode);
        console.log("Message ID:", response[0].headers['x-message-id']);
        console.log("\n📧 Check your inbox:", testEmail.to);
        console.log("Subject:", testEmail.subject);
        console.log("\nIf you don't see it, check your spam folder!");
        console.log("================================================\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ ========== EMAIL SENDING FAILED! ==========");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        if (error.response) {
            console.error("\nSendGrid Response:");
            console.error("Status Code:", error.response.statusCode);
            console.error("Body:", JSON.stringify(error.response.body, null, 2));

            // Specific error diagnosis
            if (error.response.statusCode === 401) {
                console.error("\n🔑 PROBLEM: Invalid API Key");
                console.error("SOLUTION:");
                console.error("1. Go to https://app.sendgrid.com/settings/api_keys");
                console.error("2. Create a new API key with 'Mail Send' permission");
                console.error("3. Copy the key and update SENDGRID_API_KEY in .env");
                console.error("4. Restart this test");
            } else if (error.response.statusCode === 403) {
                console.error("\n🚫 PROBLEM: Sender Not Verified or Permission Denied");
                console.error("SOLUTION:");
                console.error("1. Go to https://app.sendgrid.com/settings/sender_auth");
                console.error("2. Click 'Verify a Single Sender'");
                console.error("3. Add and verify:", process.env.SENDGRID_FROM_EMAIL);
                console.error("4. Check your email for verification link");
                console.error("5. Wait a few minutes after verification");
                console.error("6. Run this test again");
            } else if (error.response.statusCode === 400) {
                console.error("\n📝 PROBLEM: Bad Request");
                console.error("Check that your sender email is verified in SendGrid");
            }
        }

        console.error("\n==============================================\n");
        process.exit(1);
    });
