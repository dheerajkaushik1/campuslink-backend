const express = require('express');
const router = express.Router();

const {uploadNote, getAllNotes, searchNotes, deleteNote} = require('../controllers/noteController');

// Upload Note
router.post("/upload", uploadNote);

// Get All Notes
router.get("/all", getAllNotes);

// Search Notes
router.get("/search", searchNotes);

// Delete Note
router.delete("/delete/:id", deleteNote);

module.exports = router;