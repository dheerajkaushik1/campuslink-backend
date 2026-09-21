const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");

// ======================================================
// Get User Profile
// ======================================================

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // ------------------------------------------
        // Get user information
        // ------------------------------------------

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // ------------------------------------------
        // Get user's quiz history
        // ------------------------------------------

        const history = await Leaderboard.find({
            user: userId,
        })
            .sort({ createdAt: -1 })
            .lean();

        // ------------------------------------------
        // No quiz history
        // ------------------------------------------

        if (history.length === 0) {
            return res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    occupation: user.occupation,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                },

                stats: {
                    totalQuizzes: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    averagePercentage: 0,
                    bestPercentage: 0,
                },

                subjectPerformance: [],

                recentHistory: [],
            });
        }

        // ------------------------------------------
        // Overall statistics
        // ------------------------------------------

        const totalQuizzes = history.length;

        const totalQuestions = history.reduce(
            (total, quiz) =>
                total + quiz.totalQuestions,
            0
        );

        const correctAnswers = history.reduce(
            (total, quiz) =>
                total + quiz.score,
            0
        );

        const percentages = history.map((quiz) => {
            return Math.round(
                (quiz.score / quiz.totalQuestions) * 100
            );
        });

        const averagePercentage = Math.round(
            percentages.reduce(
                (total, percentage) =>
                    total + percentage,
                0
            ) / percentages.length
        );

        const bestPercentage = Math.max(
            ...percentages
        );

        // ------------------------------------------
        // Subject-wise performance
        // ------------------------------------------

        const subjects = {};

        history.forEach((quiz) => {
            const percentage = Math.round(
                (quiz.score / quiz.totalQuestions) * 100
            );

            if (!subjects[quiz.subject]) {
                subjects[quiz.subject] = {
                    subject: quiz.subject,
                    attempts: 0,
                    totalPercentage: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                };
            }

            subjects[quiz.subject].attempts += 1;

            subjects[quiz.subject].totalPercentage +=
                percentage;

            subjects[quiz.subject].totalQuestions +=
                quiz.totalQuestions;

            subjects[quiz.subject].correctAnswers +=
                quiz.score;
        });

        const subjectPerformance = Object.values(
            subjects
        ).map((subject) => ({
            subject: subject.subject,

            attempts: subject.attempts,

            averagePercentage: Math.round(
                subject.totalPercentage /
                subject.attempts
            ),

            totalQuestions:
                subject.totalQuestions,

            correctAnswers:
                subject.correctAnswers,
        }));

        // ------------------------------------------
        // Recent quiz history
        // ------------------------------------------

        const recentHistory = history
            .slice(0, 10)
            .map((quiz) => ({
                _id: quiz._id,

                subject: quiz.subject,

                examType: quiz.examType,

                examName: quiz.examName,

                difficulty: quiz.difficulty,

                score: quiz.score,

                totalQuestions:
                    quiz.totalQuestions,

                percentage: Math.round(
                    (quiz.score / quiz.totalQuestions) * 100
                ),

                createdAt:
                    quiz.createdAt,
            }));

        // ------------------------------------------
        // Send response
        // ------------------------------------------

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                occupation: user.occupation,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            },

            stats: {
                totalQuizzes,
                totalQuestions,
                correctAnswers,
                averagePercentage,
                bestPercentage,
            },

            subjectPerformance,

            recentHistory,
        });

    } catch (error) {
        console.error(
            "Get User Profile Error:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUserProfile,
};