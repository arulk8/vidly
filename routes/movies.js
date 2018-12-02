const express = require("express");
const { Movies, validateMovie } = require("../models/moviesModel");
const { Genres } = require("../models/genresModel");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movies.find().sort({ title: 1 });
    res.send(movies);
    return false;
  } catch (err) {
    res.status(500).send(`Error occured please try again ${err.message}`);
    return false;
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    res.send(movie);
    return false;
  } catch (err) {
    res.status(500).send(`Error occured please try again ${err.message}`);
    return false;
  }
  if (!movie) {
    res.status(404).send("The movie with given ID is not found");
    return false;
  }
});

router.post("/", auth, async (req, res) => {
  // const result = validateMovie(res.body);
  console.log(req.body);
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return false;
  }
  try {
    let genre = await Genres.findById(req.body.genreId);
    console.log(req.body.genreId);
    if (!genre) {
      res.status(400).send("Invalid genre");
      return false;
    }
    movie = new Movies({
      title: req.body.title,
      genre: { _id: genre.id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    res.send(movie);
    return false;
  } catch (err) {
    res.status(500).send(`Error occured please try again ${err.message}`);
    return false;
  }
});

router.put("/:id", auth, async (req, res) => {
  //const result = validateMovie(req.body);
  // result.error ie equvalent to { error }
  const { error } = validateMovie(req.body); // object destructuring, here result.error can be assigned { error }
  if (error) {
    res.status(400).send(error.details[0].message); //  invalid bad request
    return false;
  }
  try {
    let genre = await Genres.findById(req.body.genreId);
    if (!genre) {
      res.status(400).send("Invalid genre");
      return false;
    }
    movie = await Movies.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: { _id: genre.id, name: genre.name },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );
    if (!movie) {
      res.status(404).send("The movie with given ID is not found"); //  resource not found
      return false;
    }
    res.send(movie);
    return false;
  } catch (err) {
    res.status(500).send(`Error occured while updating ${err.message}`);
    return false;
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movies.findByIdAndRemove(req.params.id);
    if (!movie) {
      res.status(404).send("The movie with given ID is not found"); //  resource not found
      return false;
    }
    res.send(movie);
    return false;
  } catch (err) {
    req.status(500).send(`Error occured while deleting + ${err.message}`);
    return false;
  }
});

module.exports = router;
