const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
},
{
    timestamps: true,
    _id: true,
}
);

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    value: {
        type: Number,
        min:  1,
        max: 5,
        required: true,
    },
    },
    {
    _id: false,
    }
);


const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    description: String,

    previewUrl: {
        type: String,
        required: true,
    },

    downloadUrl: {
        type: String,
        required: true,
    },

    uploadedBy: {
        type: String
    },

    rating: {
        type:  [ratingSchema],
        default: [],
    },

    comment: {
        type: [commentSchema],
        default: [],
    },

    views: {
        type: Number,
        default: 30,
    },

    downloads: {
        type: Number,
        default: 20,
    },
}, 
    {
    timestamps: true
    }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;