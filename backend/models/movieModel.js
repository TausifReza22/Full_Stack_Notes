const mongoose = require("mongoose");
const moviesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // mongo db will automatically create an id for the document. // object id is a data type in mongodb that is used to store the unique identifier of the document.
  title: String,
  director: String,
  genre: [String],
  year: Number,
});


// Model => It is a constructor function that takes the schema and creates an instance of the document. It represents the collection in the database. COMPILED VERSION OF SCHEMA

const Movies = mongoose.model("Movies", moviesSchema); // Movies is the name of the collection in the database.


module.exports = Movies; // exporting the model to use it in other files.