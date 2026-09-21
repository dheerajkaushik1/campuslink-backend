const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        occupation: {
            type: String,
            default: "Student",
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;