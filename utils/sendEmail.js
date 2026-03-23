require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"Campuslink" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your campuslink account",
            html: `
            <div style="font-family: Arial; padding: 20px;">
            <h2>CampusLink Verification</h2>
            <p>Your OTP is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This OTP will expire in 5 minutes.</p>
        </div>
        `,
        };
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
}

module.exports = { sendOTPEmail };