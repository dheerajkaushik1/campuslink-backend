const User = require("../models/User");
const Note = require("../models/Note");
const Syllabus = require("../models/Syllabus");
const PyP = require("../models/PyP");

const models = {
    note: {
        model: Note,
        field: "notes",
    },
    syllabus: {
        model: Syllabus,
        field: "syllabus",
    },
    paper: {
        model: PyP,
        field: "papers",
    },
};

// Toggle Favorite
const toggleFavorite = async (req, res) => {
    try {
        const { type, id } = req.params;

        const config = models[type];

        if (!config) {
            return res.status(400).json({
                message: "Invalid favorite type",
            });
        }

        const resource = await config.model.findById(id);

        if (!resource) {
            return res.status(404).json({
                message: `${type} not found`,
            });
        }

        const user = await User.findById(req.user.id);

        const favorites = user.favorites[config.field];

        const exists = favorites.some(
            (favId) => favId.toString() === id
        );

        if (exists) {
            user.favorites[config.field] = favorites.filter(
                (favId) => favId.toString() !== id
            );

            await user.save();

            return res.json({
                message: "Removed from favorites",
                favorites: user.favorites[config.field],
            });
        }

        favorites.push(id);

        await user.save();

        res.json({
            message: "Added to favorites",
            favorites: user.favorites[config.field],
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Favorites
const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("favorites.notes")
            .populate("favorites.syllabus")
            .populate("favorites.papers");

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