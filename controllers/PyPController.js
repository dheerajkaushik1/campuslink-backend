const PyP = require("../models/PyP");

// upload paper
const uploadPaper = async (req, res) => {
    try {
        const { title,
            subject,
            branch,
            semester,
            year,
            examType,
            previewUrl,
            downloadUrl
        } = req.body;

        const paper = await PyP.create({
            title,
            subject,
            branch,
            semester,
            year,
            examType,
            previewUrl,
            downloadUrl,
            uploadedBy: "Dheeraj Kauhsik",
        });

        res.json(paper);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// get all paper 
const getAllPaper = async (req, res) => {
    try {
        const pyp = await PyP.find().sort({ createdAt: -1 });
        res.json(pyp);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

// Search Paper

const searchPaper = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const paper = await PyP.find({
            $or: [
                { subject: { $regex: query, $options: "i" } },
                { title: { $regex: query, $options: "i" } },
                { branch: { $regex: query, $options: "i" } },
            ],
        });

        res.json(paper);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Edit / Update Paper

const editPaper = async (req, res) => {
    try {
        const {
            title,
            subject,
            branch,
            semester,
            year,
            examType,
            previewUrl,
            downloadUrl
        } = req.body;

        const paper = await PyP.findByIdAndUpdate(
            req.params.id,
            {
                title,
                subject,
                branch,
                semester,
                year,
                examType,
                previewUrl,
                downloadUrl,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!paper) {
            return res.status(404).json({
                message: "Paper not found!",
            });
        }

        res.json({
            message: "Paper updated successfully! ✏️",
            paper,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
    searchPaper,
    uploadPaper,
    getAllPaper,
    editPaper
}