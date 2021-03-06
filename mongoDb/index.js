
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/tetraflix');

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(error);
});

db.once('open', () => {
  // Now connected to tetraflix database
});

const movieSchema = mongoose.Schema({
  movieId: Number,
  title: String,
  views: Number,
  progress: {
    type: Number,
    default: 0,
  },
  profile: {
    action: Number,
    animation: Number,
    comedy: Number,
    documentary: Number,
    drama: Number,
    family: Number,
    fantasy: Number,
    international: Number,
    horror: Number,
    musical: Number,
    mystery: Number,
    romance: Number,
    sci_fi: Number,
    thriller: Number,
    western: Number,
  },
});

// top 20 recommendations for each genre

const genreRecSchema = mongoose.Schema({
  genre: {
    type: String,
    unique: true,
  },
  createdAt: Date,
  recs: [movieSchema],
});

const GenreRec = mongoose.model('GenreRec', genreRecSchema);


// top 20 recommendations and currently watching for each user

const userMoviesSchema = mongoose.Schema({
  _id: Number,
  recs: [movieSchema],
  cw: [movieSchema],
});

const UserMovies = mongoose.model('UserMovies', userMoviesSchema);


module.exports = {
  db,
  GenreRec,
  UserMovies,
};
