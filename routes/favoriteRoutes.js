const express = require("express");
const router = express.Router();

const {toggleFavorite,getFavorites} = require("../controllers/favoriteController");

const {protect} = require("../middlewares/authMiddleware");

router.post("/:type/:id", protect, toggleFavorite);
router.get("/", protect, getFavorites);

module.exports = router;