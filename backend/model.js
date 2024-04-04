import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  adult: Boolean,
  backdrop_path: String,
  id: Number,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
});

// Create a Mongoose model based on the schema
const Watchlist = mongoose.model("Watchlist", movieSchema);

// Export the model
export default Watchlist;
