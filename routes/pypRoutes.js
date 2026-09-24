const express = require("express");
const router = express.Router();

const {
    uploadPaper,
    getAllPaper,
    searchPaper,
    editPaper
} = require("../controllers/PyPController");

// Upload Paper
router.post("/upload-paper", uploadPaper);

// get all paper
router.get("/all-paper", getAllPaper);

// search Paper
router.get("/search-paper", searchPaper);

// Update Paper
router.put("/:id", editPaper);

module.exports = router;