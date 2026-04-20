const mongoose = require('mongoose');

const NoteRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending',
    },
},
    {
        timestamps: true,
    });

const NoteRequest = mongoose.model('NoteRequest', NoteRequestSchema);

module.exports = NoteRequest;