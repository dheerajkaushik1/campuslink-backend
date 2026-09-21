const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
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

        score: {
            type: Number,
            required: true,
            min: 0,
        },

        totalQuestions: {
            type: Number,
            required: true,
            min: 1,
        },

        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

const Leaderboard = mongoose.model(
    "Leaderboard",
    leaderboardSchema
);

module.exports = Leaderboard;