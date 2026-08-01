const express = require("express");
const router = express.Router();

const {
    uploadPaper,
    getAllPaper,
    searchPaper
} = require("../controllers/PyPController");

// Upload Paper
router.post("/upload-paper", uploadPaper);

// get all paper
router.get("/all-paper", getAllPaper);

// search Paper
router.get("/search-paper", searchPaper);

module.exports = router;