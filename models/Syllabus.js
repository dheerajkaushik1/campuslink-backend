const mongoose = require("mongoose");
const syllabusSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
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

module.exports = mongoose.model("Syllabus", syllabusSchema);