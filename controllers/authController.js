const User = require('../models/User');
const { generateOTP } = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//Signup - Send OTP

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        let user = await User.findOne({ email });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        if (!user) {
            user = new User({ email, password, otp, otpExpiry, name });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        res.json({ message: "OTP sent to email" });
        console.log("Before sending email");

        sendOTPEmail(email, otp);

        console.log("After sending email");

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}



// verify otp

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.json({ message: "Account Verified!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account not verified!" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );


        res.json({
            message: "Login Successful!",
            token,
            user: {
                id: user._id,
                email: user.email,
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-otp -otpExpiry");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

module.exports = { signup, verifyOTP, login, getProfile };