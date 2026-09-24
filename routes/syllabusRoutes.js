const express = require("express");
const router = express.Router();

const {
    uploadSyllabus,
    getAllSyllabus,
    searchSyllabus,
    editSyllabus
} = require("../controllers/syllabusController");

// Upload Syllabus
router.post("/upload-syllabus", uploadSyllabus);

// get all Syllabus
router.get("/all-syllabus", getAllSyllabus);

// Search Syllabus
router.get("/search-syllabus", searchSyllabus);

// Update Syllabus
router.put("/:id", editSyllabus);

module.exports = router;