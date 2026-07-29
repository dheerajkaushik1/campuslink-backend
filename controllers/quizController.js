const ai = require("../utils/gemini");
const QuizSession = require("../models/QuizSession");
const Leaderboard = require("../models/Leaderboard");


// Start Quiz
const startQuiz = async (req, res) => {
    try {
        const { subject, difficulty } = req.body;

        const prompt = `
        Generate exactly 10 multiple choice questions.

Subject: ${subject}
Difficulty: ${difficulty}

Rules:
1. Return ONLY valid JSON.
2. No markdown.
3. No explanation.
4. Exactly 10 questions.
5. Every question must have:
   - question
   - options (4 strings)
   - correctAnswer (0-3)

Example:

[
  {
    "question":"...",
    "options":["A","B","C","D"],
    "correctAnswer":2
  }
]`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        let text = response.text;

        // Remove markdown code fences if present
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const quiz = JSON.parse(text);

        const session = await QuizSession.create({
            user: req.user.id,
            subject,
            difficulty,
            questions: quiz,
        });

        const questions = quiz.map((q) => ({
            question: q.question,
            options: q.options,
        }))

        res.json({
            quizId: session._id,
            questions,
        });

    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


// Submit Quiz

const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const session = await QuizSession.findById(quizId);

        if (!session) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        let score = 0;
        session.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score++;
            }
        });

        await Leaderboard.create({
            user: req.user.id,
            subject: session.subject,
            difficulty: session.difficulty,
            score,
            totalQuestions: session.questions.length,
        });

        await QuizSession.findByIdAndDelete(quizId);

        res.json({
            score,
            totalQuestions: session.questions.length,
        });


    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// get leaderboard

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .populate("user", "name")
            .sort({ score: -1, createdAt: 1 });

        res.json(leaderboard);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    startQuiz,
    submitQuiz,
    getLeaderboard,
}