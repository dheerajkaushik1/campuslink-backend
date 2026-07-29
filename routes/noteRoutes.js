const express = require('express');
const router = express.Router();

const {uploadNote, getAllNotes, searchNotes, deleteNote, increamentDownload, increamentView} = require('../controllers/noteController');

// Upload Note
router.post("/upload", uploadNote);

// Get All Notes
router.get("/all", getAllNotes);

// Search Notes
router.get("/search", searchNotes);

// Delete Note
router.delete("/delete/:id", deleteNote);

// Increament Views
router.post("/:noteId/views", increamentView);

// Increament Downloads
router.post("/:noteId/downloads", increamentDownload);



module.exports = router;