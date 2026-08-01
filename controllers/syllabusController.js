const Syllabus = require("../models/Syllabus");

// Upload syllabus

const uploadSyllabus = async (req, res) => {
    try {
        const { subject, branch, semester, previewUrl, downloadUrl } = req.body;

        const syllabus = await Syllabus.create({
            subject,
            branch,
            semester,
            previewUrl,
            downloadUrl,
            uploadedBy: "Dheeraj Kaushik",
        });

        res.json(syllabus);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Syllabuses

const getAllSyllabus = async (req, res) => {
    try {
        const syllabuses = await Syllabus.find().sort({ createdAt: -1 });

        res.json(syllabuses);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Search Syllabus

const searchSyllabus = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const syllabus = await Syllabus.find({
            $or: [
                { subject: { $regex: query, $options: "i" } },
                { branch: { $regex: query, $options: "i" } },
            ],
        });

        res.status(201).json(syllabus);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

module.exports ={
    uploadSyllabus,
    getAllSyllabus,
    searchSyllabus,
}
