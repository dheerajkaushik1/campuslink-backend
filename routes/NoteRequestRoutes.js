const express = require('express');
const {createNoteRequest, getAllNoteRequests, updateNoteRequestStatus, deleteNoteRequest} = require('../controllers/NoteRequestController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Note Request
router.post("/create", protect, createNoteRequest);

// Admin: Get All Note Requests
router.get("/all", getAllNoteRequests); 

// Admin: Update Note Request Status
router.put("/update-status/:id", updateNoteRequestStatus);

// Admin: Delete Note Request
router.delete("/delete/:id", deleteNoteRequest);

module.exports = router;