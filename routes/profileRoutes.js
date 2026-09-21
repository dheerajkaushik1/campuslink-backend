const express = require("express");

const router = express.Router();

const {
    getUserProfile,
} = require("../controllers/profileController");

const {protect} = require("../middlewares/authMiddleware");

// Get logged-in user's profile + quiz performance + history
router.get("/", protect, getUserProfile);

module.exports = router;