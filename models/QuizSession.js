const mongoose = require("mongoose");

const quizSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        examType: {
            type: String,
            enum: ["college", "competitive", "specific"],
            required: true,
        },

        examName: {
            type: String,
            trim: true,
            default: null,
        },

        difficulty: {
            type: String,
            required: true,
            trim: true,
        },

        totalQuestions: {
            type: Number,
            required: true,
        },

        durationMinutes: {
            type: Number,
            required: true,
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },

                options: {
                    type: [String],
                    required: true,
                },

                correctAnswer: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 3,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const QuizSession = mongoose.model(
    "QuizSession",
    quizSessionSchema
);

module.exports = QuizSession;