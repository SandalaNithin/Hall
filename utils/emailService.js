const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        console.log("📧 Attempting to send email...");
        console.log("   To:", options.recipient === 'user' ? options.email : process.env.EMAIL_USER);
        console.log("   Subject:", options.subject);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465, // SSL port
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Determine recipient: if options.recipient is 'user', send to user's email
        // Otherwise, send to owner (for booking confirmations)
        const recipientEmail = options.recipient === 'user'
            ? options.email
            : process.env.EMAIL_USER;

        const message = {
            from: `"${options.name}" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            replyTo: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        console.log("✅ Email sent successfully! Message ID:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email sending failed:");
        console.error("   Error:", error.message);
        console.error("   Code:", error.code);
        throw error;
    }
};

module.exports = sendEmail;
