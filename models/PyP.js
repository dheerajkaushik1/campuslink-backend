const mongoose = require("mongoose");

const pypSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        branch: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
        },

        year: {
            type: Number,
            required: true,
        },

        examType: {
            type: String,
            enum: ["Mid Semester", "End Semester"],
            required: true,
        },

        previewUrl: {
            type: String,
            required: true,
        },

        downloadUrl: {
            type: String,
            required: true,
        },

        uploadedBy: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PyP", pypSchema);