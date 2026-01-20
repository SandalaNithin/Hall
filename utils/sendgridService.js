const sgMail = require("@sendgrid/mail");

// Initialize SendGrid with API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    try {
        console.log("📧 Attempting to send email via SendGrid...");
        console.log("   To:", options.recipient === 'user' ? options.email : process.env.ADMIN_EMAIL);
        console.log("   Subject:", options.subject);

        // Determine recipient: if options.recipient is 'user', send to user's email
        // Otherwise, send to admin email
        const recipientEmail = options.recipient === 'user'
            ? options.email
            : process.env.ADMIN_EMAIL;

        // Prepare email message
        const message = {
            to: recipientEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: process.env.SENDGRID_FROM_NAME || "Lakshmi Function Hall"
            },
            replyTo: options.email,
            subject: options.subject,
            html: options.html,
        };

        // Send email using SendGrid
        const response = await sgMail.send(message);

        console.log("✅ Email sent successfully via SendGrid!");
        console.log("   Status Code:", response[0].statusCode);
        console.log("   Message ID:", response[0].headers['x-message-id']);

        return {
            messageId: response[0].headers['x-message-id'],
            statusCode: response[0].statusCode
        };
    } catch (error) {
        console.error("❌ SendGrid email sending failed:");
        console.error("   Error:", error.message);

        if (error.response) {
            console.error("   Status Code:", error.response.statusCode);
            console.error("   Body:", error.response.body);
        }

        throw error;
    }
};

module.exports = sendEmail;
