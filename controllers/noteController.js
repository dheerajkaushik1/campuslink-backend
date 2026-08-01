const { default: mongoose } = require("mongoose");
const Note = require("../models/Note");

//Upload Note
const uploadNote = async (req, res) =>{
    try{
        const {title, subject, description, previewUrl, downloadUrl} = req.body;

        const note = await Note.create({
            title,
            subject,
            description,
            previewUrl,
            downloadUrl,
            uploadedBy: "Dheeraj Kaushik",
        });

        res.json(note);
    } catch (err) {
        res.status(500).json({message: "Server Error", error: err.message});
    }
}


// Get All Notes
const getAllNotes = async (req, res) => {
    try{
        const notes = await Note.find().sort({createdAt: -1});
        res.json(notes);
    } catch (err) {
        res.status(500).json({message: "Server Error", error: err.message});
    }
}



//Search Notes
const searchNotes = async (req, res) => {
    try{
        const {query} = req.query;

        const notes = await Note.find({
            title: {
                $regex: query,
                $options: "i"
            },
        });
        res.json(notes);
    } catch (err) {
        res.status(500).json({message: "Server Error", error: err.message});
    }
};


//Delete a Note

const deleteNote = async (req, res) => {
    try{
        await Note.findByIdAndDelete(req.params.id);
        res.json({message: "Note Deleted! 🗑️"});
    } catch (err){
        res.status(500).json({message: "Server Error", error: err.message});
    }
}

// Increament Views count

const increamentView = async (req, res) => {
    try{
        const {noteId} = req.params;

        const note = await Note.findByIdAndUpdate(
            noteId,
            {
                $inc: {views: 1},
            },
            {
                new: true,
            }
        );

        if(!note){
            return res.status(404).json({
                message: "Note not found!",
            });
        }

        res.json({
            message: "View count updated",
            views: note.views,
        });

    } catch (error){
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Increament Download Count

const increamentDownload = async (req, res) => {
    try{
        const {noteId} = req.params;

    const note = await Note.findByIdAndUpdate(
        noteId,
        {
            $inc: {downloads: 1}, 
        },
        {
            new: true,
        }
    );

    if(!note){
        return res.status(404).json({
            message: "Note not found!",
        });
    }

    res.json({
        message: "Downloads count updated",
        downloads: note.downloads,
    });
    } catch (error){
        res.status(500).json({
            message: "server error",
            error: error.message,
        });
    }
};

module.exports = {
    uploadNote,
    getAllNotes,
    searchNotes,
    deleteNote,
    increamentView,
    increamentDownload,
}