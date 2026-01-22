const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function checkSendGridStatus() {
    console.log('🔍 SendGrid Configuration Check\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('   SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ NOT SET');
    console.log('   SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || '❌ NOT SET');
    console.log('   SENDGRID_FROM_NAME:', process.env.SENDGRID_FROM_NAME || '❌ NOT SET');
    console.log('   ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ NOT SET');
    console.log('');

    // Try to send a test email
    console.log('📧 Sending test email...\n');

    const message = {
        to: process.env.ADMIN_EMAIL,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME
        },
        subject: '🧪 SendGrid Diagnostic Test - ' + new Date().toLocaleTimeString(),
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">🧪 SendGrid Diagnostic Test</h2>
            <p>This email was sent at: <strong>${new Date().toLocaleString()}</strong></p>
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46;">
                    ✅ If you received this email, SendGrid is working correctly!
                </p>
            </div>
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;">
                    ⚠️ If this email is in your spam folder, mark it as "Not Spam" to improve deliverability.
                </p>
            </div>
            <hr>
            <p style="font-size: 12px; color: #6b7280;">
                From: ${process.env.SENDGRID_FROM_EMAIL}<br>
                To: ${process.env.ADMIN_EMAIL}<br>
                API Key: ${process.env.SENDGRID_API_KEY.substring(0, 15)}...
            </p>
        </div>
        `,
    };

    try {
        const response = await sgMail.send(message);

        console.log('✅ SendGrid Response:');
        console.log('   Status Code:', response[0].statusCode);
        console.log('   Message ID:', response[0].headers['x-message-id']);
        console.log('');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📊 DIAGNOSIS RESULTS:\n');

        if (response[0].statusCode === 202) {
            console.log('✅ SendGrid API: WORKING');
            console.log('✅ Email Accepted: YES');
            console.log('');
            console.log('⚠️  IMPORTANT:');
            console.log('   Status 202 means SendGrid ACCEPTED the email.');
            console.log('   However, this does NOT guarantee delivery!\n');
            console.log('🔍 POSSIBLE REASONS FOR NON-DELIVERY:\n');
            console.log('   1. ❌ Sender email NOT VERIFIED in SendGrid');
            console.log('      → Go to: https://app.sendgrid.com/settings/sender_auth');
            console.log('      → Verify: ' + process.env.SENDGRID_FROM_EMAIL);
            console.log('');
            console.log('   2. 📧 Email in SPAM/JUNK folder');
            console.log('      → Check spam folder in Gmail');
            console.log('      → Mark as "Not Spam" if found');
            console.log('');
            console.log('   3. 🔑 API Key has LIMITED permissions');
            console.log('      → Go to: https://app.sendgrid.com/settings/api_keys');
            console.log('      → Ensure "Mail Send" permission is enabled');
            console.log('');
            console.log('   4. 🚫 SendGrid account suspended/limited');
            console.log('      → Check: https://app.sendgrid.com/');
            console.log('      → Look for any warnings or notifications');
            console.log('');
            console.log('📬 NEXT STEPS:\n');
            console.log('   1. Check your inbox: ' + process.env.ADMIN_EMAIL);
            console.log('   2. Check spam/junk folder');
            console.log('   3. If not found, verify sender in SendGrid (MOST COMMON ISSUE)');
            console.log('   4. Check SendGrid Activity Feed for delivery status:');
            console.log('      → https://app.sendgrid.com/email_activity');
        }

    } catch (error) {
        console.log('❌ SendGrid Error:\n');
        console.log('   Message:', error.message);

        if (error.response) {
            console.log('   Status Code:', error.response.statusCode);
            console.log('   Error Body:', JSON.stringify(error.response.body, null, 2));
            console.log('');

            // Specific error codes
            if (error.response.statusCode === 403) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🚨 ERROR 403: SENDER NOT VERIFIED\n');
                console.log('Your sender email is NOT verified in SendGrid.');
                console.log('This is the #1 reason emails don\'t get delivered.\n');
                console.log('FIX:');
                console.log('1. Go to: https://app.sendgrid.com/settings/sender_auth');
                console.log('2. Click "Verify a Single Sender"');
                console.log('3. Add: ' + process.env.SENDGRID_FROM_EMAIL);
                console.log('4. Check your email for verification link');
                console.log('5. Click the link to verify');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            } else if (error.response.statusCode === 401) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🚨 ERROR 401: INVALID API KEY\n');
                console.log('Your SendGrid API key is invalid or expired.\n');
                console.log('FIX:');
                console.log('1. Go to: https://app.sendgrid.com/settings/api_keys');
                console.log('2. Create a new API key with "Mail Send" permission');
                console.log('3. Update .env file with new key');
                console.log('4. Restart your server');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        }
    }
}

checkSendGridStatus();
