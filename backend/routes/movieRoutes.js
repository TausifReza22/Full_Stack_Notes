const express = require("express");
const movieController = require("../controllers/moviesController");

const router = express.Router(); // way to manage/define different routes in the routerlication.

router.get("/movies", movieController.getAllMovies);

router.post("/movies", movieController.createMovie);

router.get("/movies/search", movieController.searchMovies);

router.put("/movies/:id", movieController.updateMovie);

router.delete("/movies/:id", movieController.deleteMovie);


module.exports = router;