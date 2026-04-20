const NoteRequest = require('../models/NoteRequest');

// Create a new note request
const createNoteRequest = async (req,res) => {
    try{
        const {topic, description} = req.body;
        const noteRequest = new NoteRequest({
            user: req.user.id,
            topic,
            description,
        });

        res.status(201).json(await noteRequest.save());
    } catch (err) {
        res.status(500).json({message: "Error creating note request", error: err.message});
    }
};


// Admin: Get all note requests
const getAllNoteRequests = async (req, res) => {
    try{
        const requests = await NoteRequest.find().populate('user', 'name email').sort({createdAt: -1});

        res.json(requests);
    } catch (err){
        res.status(500).json({message: "Error getting note requests", error: err.message});
    }
};


// Admin: Update note request status
const updateNoteRequestStatus = async (req, res) => {
    try{
        const request = await NoteRequest.findById(req.params.id);
        if (!request){
            return res.status(404).json({message: "Note request not found"});
        }

        request.status = "completed";
        await request.save();

        res.json({request});
    } catch (err){
        res.status(500).json({message: "Error updating note request status", error: err.message});
    }
};

//Admin: Delete a note request
const deleteNoteRequest = async (req, res) => {
    try{
        const request = await NoteRequest.findById(req.params.id);
        if (!request){
            return res.status(404).json({message: "Note request not found"});
        }
        await NoteRequest.findByIdAndDelete(req.params.id);
        res.json({message: "Note request deleted"});
    } catch (err){
        res.status(500).json({message: "Error deleting note request", error: err.message});
    }
};


module.exports = {
    createNoteRequest,
    getAllNoteRequests,
    updateNoteRequestStatus,
    deleteNoteRequest,
}