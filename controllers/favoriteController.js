const User = require("../models/User");
const Note = require("../models/Note");

//toggle favorites
const toggleFavorite = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: "Note not Found",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.favorites) {
            user.favorites = [];
            await user.save();
        };

        const isFavorite = user.favorites.some(
            (id) => id.toString() === noteId
        );

        if (!isFavorite) {
            user.favorites.push(noteId);
            await user.save();
            return res.json({
                message: "Added to favorites",
                favorites: user.favorites,
            });
        }

        user.favorites = user.favorites.filter(
            (id) => id.toString() !== noteId
        );

        await user.save();

        res.json({
            message: "Removed from favorites",
            favorites: user.favorites,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// get favorite notes
const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');

        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    toggleFavorite,
    getFavorites,
};