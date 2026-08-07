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
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
        default: [],
    }],
},
    {
        timestamps: true
    })

const User = mongoose.model("User", userSchema);

module.exports = User;