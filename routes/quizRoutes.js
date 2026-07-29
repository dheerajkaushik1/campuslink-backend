const express = require("express");
const router = express.Router();
const { startQuiz, submitQuiz, getLeaderboard } = require("../controllers/quizController");
const {protect} = require("../middlewares/authMiddleware");

router.post("/start", protect, startQuiz);
router.post("/submit", protect, submitQuiz);

router.get("/leaderboard", getLeaderboard);

module.exports = router;