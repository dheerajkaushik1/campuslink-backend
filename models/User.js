const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        default: "Student"
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    favorites: {
        notes: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note",
            }],
            default: [],
        },

        syllabus: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Syllabus",
            }],
            default: [],
        },

        papers: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "PyP",
            }],
            default: [],
        },
    }
},
    {
        timestamps: true
    })

const User = mongoose.model("User", userSchema);

module.exports = User;