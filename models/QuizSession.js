const mongoose = require("mongoose");
const { UNSAFE_getTurboStreamSingleFetchDataStrategy } = require("react-router-dom");

const quizSessionSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            requierd: true,
        },
        questions: [
            {
                question: String,
                options: [String],
                correctAnswer: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);

module.exports = QuizSession;