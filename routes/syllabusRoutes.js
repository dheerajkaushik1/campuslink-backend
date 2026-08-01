const express = require("express");
const router = express.Router();

const {
    uploadSyllabus,
    getAllSyllabus,
    searchSyllabus
} = require("../controllers/syllabusController");

// Upload Syllabus
router.post("/upload-syllabus", uploadSyllabus);

// get all Syllabus
router.get("/all-syllabus", getAllSyllabus);

// Search Syllabus
router.get("/search-syllabus", searchSyllabus);

module.exports = router;