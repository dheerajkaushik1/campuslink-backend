const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const {signup, verifyOTP, login, getProfile} = require('../controllers/authController');

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/profile", protect, getProfile);

module.exports = router;