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
        },

        difficulty:{
            type: String,
            required: true,
        },

        score:{
            type: Number,
            required: true,
        },

        totalQuestions: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;