const ai = require("../utils/gemini");
const QuizSession = require("../models/QuizSession");
const Leaderboard = require("../models/Leaderboard");

// ======================================================
// Start Quiz
// ======================================================

const startQuiz = async (req, res) => {
    try {
        const {
            subject,
            examType,
            examName,
            difficulty,
            numberOfQuestions,
        } = req.body;

        // ==================================================
        // 1. Validate input
        // ==================================================

        if (!subject || typeof subject !== "string") {
            return res.status(400).json({
                message: "Subject is required",
            });
        }

        if (!examType) {
            return res.status(400).json({
                message: "Exam type is required",
            });
        }

        if (!difficulty) {
            return res.status(400).json({
                message: "Difficulty is required",
            });
        }

        if (
            numberOfQuestions === undefined ||
            numberOfQuestions === null
        ) {
            return res.status(400).json({
                message: "Number of questions is required",
            });
        }

        const questionCount = Number(numberOfQuestions);

        if (
            !Number.isInteger(questionCount) ||
            questionCount < 5 ||
            questionCount > 50
        ) {
            return res.status(400).json({
                message:
                    "Number of questions must be between 5 and 50",
            });
        }

        // ==================================================
        // 2. Validate exam type
        // ==================================================

        const allowedExamTypes = [
            "college",
            "competitive",
            "specific",
        ];

        if (!allowedExamTypes.includes(examType)) {
            return res.status(400).json({
                message: "Invalid exam type",
            });
        }

        // Specific exam requires exam name
        if (
            examType === "specific" &&
            (!examName || typeof examName !== "string")
        ) {
            return res.status(400).json({
                message:
                    "Exam name is required for a specific exam",
            });
        }

        // ==================================================
        // 3. Calculate quiz duration
        // ==================================================

        let durationMinutes;

        if (questionCount <= 10) {
            durationMinutes = 10;
        } else if (questionCount <= 20) {
            durationMinutes = 20;
        } else if (questionCount <= 30) {
            durationMinutes = 40;
        } else if (questionCount <= 40) {
            durationMinutes = 50;
        } else {
            durationMinutes = 60;
        }

        // ==================================================
        // 4. Create quiz timing
        // ==================================================

        const startedAt = new Date();

        const expiresAt = new Date(
            startedAt.getTime() +
            durationMinutes * 60 * 1000
        );

        // ==================================================
        // 5. Create unique generation seed
        // ==================================================

        const quizSeed =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 10)}`;

        // ==================================================
        // 6. Build exam context
        // ==================================================

        let examContext = "";

        if (examType === "college") {
            examContext = `
This is a COLLEGE/UNIVERSITY examination preparation quiz.

Focus on:
- syllabus-oriented concepts
- theoretical understanding
- important definitions
- conceptual questions
- application of learned concepts
- typical university examination patterns

Do not make the questions unnecessarily competitive-exam oriented.
`;
        }

        if (examType === "competitive") {
            examContext = `
This is a GENERAL COMPETITIVE EXAMINATION preparation quiz.

Focus on:
- conceptual understanding
- reasoning
- application
- problem solving
- numerical reasoning where relevant
- elimination-based MCQs
- questions requiring careful thinking
- competitive examination style

Avoid questions that are purely based on trivial factual recall.
`;
        }

        if (examType === "specific") {
            examContext = `
This quiz is specifically designed for:

EXAMINATION:
${examName}

The questions must be relevant to the examination "${examName}".

Follow the typical:
- syllabus
- conceptual level
- question style
- difficulty
- reasoning requirements
- subject coverage

Do not generate generic questions unrelated to the target examination.
`;
        }

        // ==================================================
        // 7. AI Prompt
        // ==================================================

        const prompt = `
You are an expert examination question setter.

Generate EXACTLY ${questionCount} multiple-choice questions.

==================================================
QUIZ CONFIGURATION
==================================================

SUBJECT:
${subject}

EXAM TYPE:
${examType}

SPECIFIC EXAM:
${examName || "Not specified"}

DIFFICULTY:
${difficulty}

NUMBER OF QUESTIONS:
${questionCount}

UNIQUE QUIZ SEED:
${quizSeed}

==================================================
EXAM CONTEXT
==================================================

${examContext}

==================================================
SUBJECT RESTRICTION
==================================================

Every question MUST belong strictly to the subject:

"${subject}"

Do NOT introduce unrelated subjects.

For example, if the subject is DBMS, do not ask questions primarily about:
- Computer Networks
- Operating Systems
- DSA
- Computer Graphics

unless that concept is directly relevant to the specified subject.

The quiz must remain focused on "${subject}".

==================================================
DIFFICULTY
==================================================

Every question must match the requested difficulty:

"${difficulty}"

Do not mix easy questions into a hard quiz or difficult questions
into an easy quiz.

==================================================
QUESTION QUALITY
==================================================

- Test understanding rather than memorization wherever appropriate.
- Include reasoning and application-based questions where appropriate.
- Avoid repetitive question patterns.
- Avoid obvious or predictable questions.
- Avoid duplicate questions.
- Vary the question structure.
- Vary the position of the correct answer.
- Make distractor options plausible.
- Do not make the correct answer obvious because it is longer or more detailed.
- Do not repeat the same concept excessively.
- Make the quiz feel like a genuine examination.

==================================================
UNIQUENESS
==================================================

This is a newly generated quiz attempt.

Create a substantially different question set from other attempts.

Use the unique generation seed:

${quizSeed}

Do not intentionally reuse common question wording.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY a valid JSON array.

Do NOT return:
- markdown
- code fences
- explanations
- comments
- introductory text
- concluding text

Each question MUST have exactly this structure:

{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0
}

correctAnswer must be:

0 = first option
1 = second option
2 = third option
3 = fourth option

Every question MUST have exactly 4 options.

Return EXACTLY ${questionCount} questions.
`;

        // ==================================================
        // 8. Generate quiz using Gemini
        // ==================================================

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        let text = response.text;

        // Remove markdown code fences if AI adds them
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // ==================================================
        // 9. Parse JSON
        // ==================================================

        let quiz;

        try {
            quiz = JSON.parse(text);
        } catch (error) {
            console.error("AI JSON Parse Error:", error);
            console.error("AI Response:", text);

            return res.status(500).json({
                message: "AI returned invalid quiz data",
            });
        }

        // ==================================================
        // 10. Validate quiz structure
        // ==================================================

        if (!Array.isArray(quiz)) {
            return res.status(500).json({
                message: "AI returned invalid quiz format",
            });
        }

        if (quiz.length !== questionCount) {
            return res.status(500).json({
                message:
                    `AI generated ${quiz.length} questions instead of ${questionCount}`,
            });
        }

        // Validate every question
        for (const question of quiz) {
            if (
                !question.question ||
                typeof question.question !== "string" ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                !question.options.every(
                    (option) => typeof option === "string"
                ) ||
                !Number.isInteger(question.correctAnswer) ||
                question.correctAnswer < 0 ||
                question.correctAnswer > 3
            ) {
                return res.status(500).json({
                    message:
                        "AI generated an invalid question format",
                });
            }
        }

        // ==================================================
        // 11. Create Quiz Session
        // ==================================================

        const session = await QuizSession.create({
            user: req.user.id,

            subject: subject.trim(),

            examType,

            examName:
                examType === "specific"
                    ? examName.trim()
                    : null,

            difficulty: difficulty.trim(),

            totalQuestions: questionCount,

            durationMinutes,

            startedAt,

            expiresAt,

            questions: quiz,
        });

        // ==================================================
        // 12. Remove correct answers before sending to frontend
        // ==================================================

        const questions = quiz.map((q) => ({
            question: q.question,
            options: q.options,
        }));

        // ==================================================
        // 13. Send response
        // ==================================================

        res.json({
            quizId: session._id,

            subject: session.subject,

            examType: session.examType,

            examName: session.examName,

            difficulty: session.difficulty,

            totalQuestions: questionCount,

            durationMinutes,

            startedAt,

            expiresAt,

            questions,
        });

    } catch (error) {
        console.error("Start Quiz Error:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};


// ======================================================
// Submit Quiz
// ======================================================

const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        // ==================================================
        // 1. Validate request
        // ==================================================

        if (!quizId) {
            return res.status(400).json({
                message: "Quiz ID is required",
            });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                message: "Answers must be an array",
            });
        }

        // ==================================================
        // 2. Find quiz belonging to current user
        // ==================================================

        const session = await QuizSession.findOne({
            _id: quizId,
            user: req.user.id,
        });

        if (!session) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        // ==================================================
        // 3. Check server-side expiration
        // ==================================================

        const now = new Date();

        if (now > session.expiresAt) {
            await QuizSession.findByIdAndDelete(quizId);

            return res.status(400).json({
                message: "Quiz time has expired",
            });
        }

        // ==================================================
        // 4. Calculate score
        // ==================================================

        let score = 0;

        const wrongQuestions = [];

        session.questions.forEach((question, index) => {
            const userAnswer = answers[index];

            if (userAnswer === question.correctAnswer) {
                score++;
            } else {
                wrongQuestions.push({
                    question: question.question,

                    correctAnswer:
                        question.options[
                            question.correctAnswer
                        ],

                    yourAnswer:
                        question.options[userAnswer] ||
                        "No answer",
                });
            }
        });

        // ==================================================
        // 5. Calculate result
        // ==================================================

        const totalQuestions =
            session.questions.length;

        const percentage = Math.round(
            (score / totalQuestions) * 100
        );

        // ==================================================
        // 6. Save leaderboard entry
        // ==================================================

        await Leaderboard.create({
            user: req.user.id,

            subject: session.subject,

            examType: session.examType,

            examName: session.examName,

            difficulty: session.difficulty,

            score,

            totalQuestions,

            percentage,
        });

        // ==================================================
        // 7. Delete active quiz session
        // ==================================================

        await QuizSession.findByIdAndDelete(quizId);

        // ==================================================
        // 8. Send result
        // ==================================================

        res.json({
            quizId,

            score,

            totalQuestions,

            correctAnswers: score,

            wrongAnswers:
                totalQuestions - score,

            percentage,

            subject: session.subject,

            examType: session.examType,

            examName: session.examName,

            difficulty: session.difficulty,

            wrongQuestions,
        });

    } catch (error) {
        console.error("Submit Quiz Error:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};


// ======================================================
// Get Leaderboard
// ======================================================

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .populate("user", "name")
            .sort({
                score: -1,
                percentage: -1,
                createdAt: 1,
            });

        res.json(leaderboard);

    } catch (error) {
        console.error("Get Leaderboard Error:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    startQuiz,
    submitQuiz,
    getLeaderboard,
};