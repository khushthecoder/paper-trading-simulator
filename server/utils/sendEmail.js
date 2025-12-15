const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEV MODE] Email to ${options.email}: ${options.message}`);
        return; // In dev, just log if no credentials
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use host/port for other providers
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // could add HTML support later
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
