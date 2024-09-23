 const Movies = require("../models/movieModel");
const mongoose = require("mongoose");

exports.getAllMovies = (req, res) => {
  try {
    Movies.find()
      .limit(10)
      .then((result) => {
        // using limit to get only 10 documents from the database.
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getPaginatiedMovies  = (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    const limit = 10;

    // console.log(page, limit);
    const startIndex = (page - 1) * limit; // value of startindex will be 0

    Movies.find() // FIND THE DOCUMENTS FROM THE DATABASE
      .skip(startIndex) // SKIP THE DOCUMENTS FROM THE DATABASE. // SKIP THE DATA BEFORE THE START INDEX
      .limit(limit) // IT IS USED TO LIMIT THE NUMBER OF DOCUMENTS TO BE FETCHED FROM THE DATABASE.
      .then((result) => {
        res
          .status(200) // STATUS CODE 200 MEANS SUCCESS
          .send(result); // SENDING THE RESPONSE FROM THE SERVER
      });
  } catch (error) {}

  // EXAMPLE

  // PAGE = 1
  // START INDEX = (1-1)*10 = 0 // WE NEED TO START GIVING THE DATA FROM 0 INDEX TO 9
  // 0 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 9 INDEX start= 0 and limit = 10

  // PAGE = 2
  // START INDEX = (2 - 1) * 10 = 10 // WE NEED TO START GIVING THE DATA FROM 10 INDEX TO 19
  // 10 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 19 INDEX

  // PAGE = 3
  // START INDEX = (3 - 1) * 10 = 20 // WE NEED TO START GIVING THE DATA FROM 20 INDEX TO 29
  // 20 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 29 INDEX
}


exports.createMovie = (req, res) => {
  const newMovie = new Movies({
    _id: new mongoose.Types.ObjectId(), // to create a new object id
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    year: req.body.year,
  });
  console.log(newMovie, " new movie");

  newMovie
    .save() // save the document to the database or collection, or update the document in the database.
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};



exports.searchMovies = (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.status(400).send({ message: "Search query is required" }); // error message
  }
  try {
    Movies.find({
      title: new RegExp(search, "i"), // i => case insensitive, it will ignore the case of the string. "g" => global search, "m" => multiline search
    }).then((result) => {
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).send(error);
  }

  // res.status(200).send("hello")
};



exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMovie) return res.status(404).send("Movie not found");
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).send(err.message);
  }
};





 exports.deleteMovie = async (req, res) => {
   // id =123  DESTRUCTURING req.params = { id: 123 }
   // const { id } = req.params.id;   // {id: {id: 123}}}  INCORRECT STATEMENT
   const id = req.params.id; //   req.params = { id: 123 } // DESTRUCTURING, CORRECT STATEMENT
   console.log(id);

   try {
     const deletedMovie = await Movies.findByIdAndDelete(id); // DELETE THE DOCUMENT FROM THE DATABASE using UNNQUE ID
     if (!deletedMovie) return res.status(404).send("Movie not found"); // error handling  404 => NOT FOUND
     res.json({ message: "Movie deleted successfully" });
   } catch (error) {
     res.status(500).send(error);
   }
};
 
