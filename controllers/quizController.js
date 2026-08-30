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
You are an expert competitive examination question setter.

Generate EXACTLY 10 multiple-choice questions.

SUBJECT: ${subject}

DIFFICULTY: ${difficulty}

IMPORTANT RULES:

- ALL questions MUST belong ONLY to the subject "${subject}".
- DO NOT include questions from any other subject.
- The difficulty MUST be "${difficulty}".
- Make every quiz different from previous ones.
- Avoid repeating common or overly predictable questions.
- Questions must test understanding, reasoning, and application where appropriate.
- Return ONLY a valid JSON array.
- Do not include markdown, explanations, comments, or any text outside the JSON array.

Each question must contain exactly:

{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0
}

The "correctAnswer" must be the zero-based index of the correct option:
0 = A
1 = B
2 = C
3 = D

SPECIAL EXAM INSTRUCTIONS:

If the subject is "Computer - NIMCET":
- Treat the quiz as NIMCET MCA entrance-examination preparation.
- Questions should match the conceptual level, reasoning style, and difficulty expected in NIMCET.
- Cover relevant NIMCET Computer topics such as computer fundamentals, number systems, data representation, Boolean algebra, digital logic, C/C++ fundamentals, data structures, algorithms, operating systems, DBMS, computer networks, and computer architecture.
- Prefer conceptual and problem-solving questions over simple factual recall.
- Do NOT generate university-semester-exam questions.

If the subject is "English - NIMCET":
- Treat the quiz as NIMCET MCA entrance-examination preparation.
- Questions should match the level and style expected in NIMCET.
- Focus on vocabulary, synonyms, antonyms, grammar, sentence correction, error detection, fill-in-the-blanks, idioms and phrases, sentence arrangement, and reading comprehension where appropriate.
- Prefer questions that test actual language ability rather than obscure literary knowledge.
- Do NOT generate university-semester-exam questions.

For all other subjects:
- Generate questions appropriate for the selected subject at the requested difficulty.
- Do not apply NIMCET-specific requirements.

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
        const wrongQuestions = [];
        session.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score++;
            } else {
                wrongQuestions.push({
                    question: question.question,
                    correctAnswer: question.options[question.correctAnswer],
                    yourAnswer: question.options[answers[index]] || "No answer",
                });
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

            wrongQuestions,
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
