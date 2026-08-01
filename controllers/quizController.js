const ai = require("../utils/gemini");
const QuizSession = require("../models/QuizSession");
const Leaderboard = require("../models/Leaderboard");


// Start Quiz
const startQuiz = async (req, res) => {
    try {
        const { subject, difficulty } = req.body;

        console.log({
            subject,
            difficulty
        });

        const prompt = `
You are an expert university exam paper setter.

Generate EXACTLY 10 multiple-choice questions.

SUBJECT: ${subject}
DIFFICULTY: ${difficulty}

IMPORTANT RULES:

- ALL questions MUST belong ONLY to the subject "${subject}".
- DO NOT include questions from any other subject.
- The difficulty MUST be "${difficulty}".
- Make every quiz different from previous ones.
- Avoid repeating common questions.
- Return ONLY a JSON array.

Each question must contain:

{
  "question": "...",
  "options": ["A","B","C","D"],
  "correctAnswer": 0
}

Return exactly 10 questions.
`;

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

        const totalQuestions = session.questions.length;

        const percentage = Math.round(
            (score / totalQuestions) * 100
        );



        await Leaderboard.create({
            user: req.user.id,
            subject: session.subject,
            difficulty: session.difficulty,
            score,
            totalQuestions,
        });

        await QuizSession.findByIdAndDelete(quizId);

        res.json({
            quizId,
            score,
            totalQuestions,
            correctAnswers: score,
            wrongAnswers: totalQuestions - score,
            percentage,
            subject: session.subject,
            difficulty: session.difficulty,
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
