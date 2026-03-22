const mongoose = require('mongoose');

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
}, {
    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;