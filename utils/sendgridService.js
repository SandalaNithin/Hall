const sgMail = require("@sendgrid/mail");

// Validate environment variables on module load
const validateConfig = () => {
    const required = {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL
    };

    const missing = Object.entries(required)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        console.error("❌ SENDGRID CONFIGURATION ERROR:");
        console.error("   Missing environment variables:", missing.join(", "));
        console.error("   Please check your .env file or Render environment variables");
        return false;
    }

    // Validate API key format (should start with SG.)
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        console.warn("⚠️  WARNING: SendGrid API key doesn't start with 'SG.' - it may be invalid");
    }

    console.log("✅ SendGrid configuration validated");
    console.log("   From Email:", process.env.SENDGRID_FROM_EMAIL);
    console.log("   From Name:", process.env.SENDGRID_FROM_NAME || "Lakshmi Function Hall");
    console.log("   Admin Email:", process.env.ADMIN_EMAIL);

    return true;
};

// Initialize SendGrid with API key from environment variables
if (validateConfig()) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ SendGrid API initialized");
} else {
    console.error("❌ SendGrid initialization failed - emails will not work!");
}

const sendEmail = async (options) => {
    try {
        // Validate configuration before attempting to send
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error("SendGrid API key is not configured. Please set SENDGRID_API_KEY environment variable.");
        }

        if (!process.env.SENDGRID_FROM_EMAIL) {
            throw new Error("SendGrid sender email is not configured. Please set SENDGRID_FROM_EMAIL environment variable.");
        }

        console.log("\n📧 ========== SENDING EMAIL VIA SENDGRID ==========");
        console.log("   Timestamp:", new Date().toISOString());

        // Determine recipient
        const recipientEmail = options.recipient === 'user'
            ? options.email
            : process.env.ADMIN_EMAIL;

        console.log("   Recipient Type:", options.recipient || 'admin');
        console.log("   To:", recipientEmail);
        console.log("   From:", process.env.SENDGRID_FROM_EMAIL);
        console.log("   Subject:", options.subject);
        console.log("   Reply-To:", options.email || 'N/A');

        // Validate recipient email
        if (!recipientEmail || !recipientEmail.includes('@')) {
            throw new Error(`Invalid recipient email: ${recipientEmail}`);
        }

        // Prepare email message
        const message = {
            to: recipientEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: process.env.SENDGRID_FROM_NAME || "Lakshmi Function Hall"
            },
            subject: options.subject,
            html: options.html,
        };

        // Only add replyTo if a valid email is provided
        if (options.email && options.email.includes('@')) {
            message.replyTo = options.email;
        }

        console.log("   Sending...");

        // Send email using SendGrid
        const response = await sgMail.send(message);

        console.log("✅ EMAIL SENT SUCCESSFULLY!");
        console.log("   Status Code:", response[0].statusCode);
        console.log("   Message ID:", response[0].headers['x-message-id']);
        console.log("================================================\n");

        return {
            success: true,
            messageId: response[0].headers['x-message-id'],
            statusCode: response[0].statusCode
        };

    } catch (error) {
        console.error("\n❌ ========== EMAIL SENDING FAILED ==========");
        console.error("   Timestamp:", new Date().toISOString());
        console.error("   Error Type:", error.name);
        console.error("   Error Message:", error.message);

        // SendGrid-specific error details
        if (error.response) {
            console.error("   SendGrid Status Code:", error.response.statusCode);
            console.error("   SendGrid Error Body:", JSON.stringify(error.response.body, null, 2));

            // Common SendGrid errors with helpful messages
            if (error.response.statusCode === 401) {
                console.error("\n   🔑 AUTHENTICATION ERROR:");
                console.error("      - Your SendGrid API key is invalid or expired");
                console.error("      - Generate a new API key in SendGrid dashboard");
                console.error("      - Update SENDGRID_API_KEY in your environment variables");
            } else if (error.response.statusCode === 403) {
                console.error("\n   🚫 PERMISSION ERROR:");
                console.error("      - Your SendGrid API key doesn't have permission to send emails");
                console.error("      - Ensure the API key has 'Mail Send' permission");
                console.error("      - You may need to verify your sender email in SendGrid");
            } else if (error.response.statusCode === 400) {
                console.error("\n   📝 BAD REQUEST:");
                console.error("      - Check if sender email is verified in SendGrid");
                console.error("      - Verify recipient email format is correct");
                console.error("      - Review email content for issues");
            }
        } else {
            console.error("   Stack Trace:", error.stack);
        }

        console.error("===========================================\n");

        // Re-throw with more context
        const enhancedError = new Error(`SendGrid email failed: ${error.message}`);
        enhancedError.originalError = error;
        enhancedError.sendgridResponse = error.response;
        throw enhancedError;
    }
};

module.exports = sendEmail;
