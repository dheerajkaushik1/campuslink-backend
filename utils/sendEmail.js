const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your CampusLink account',
            html: `
                <h2>CampusLink Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            `
        });

        console.log("✅ Email sent via Resend");
    } catch (err) {
        console.log("❌ Email error:", err);
    }
};