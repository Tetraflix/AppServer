const mongoDb = require('../mongoDb/index.js');
const postgresDb = require('../postgresDb/index.js');

const indexOfMovie = (CWList, movie) => {
  for (let i = 0; i < CWList.length; i += 1) {
    if (CWList[i].movieId === movie) {
      return i;
    }
  }
  return -1;
};

const calculateCW = (userId, movies) => {
  // retrieve user's currently watching list
  const query = mongoDb.UserMovies.findById(userId);
  query.select('cw')
    .then((queryResult) => {
      const CWList = queryResult.cw;
      // for each movie from the session events data
      for (let i = 0; i < movies.length; i += 1) {
        const movieIndex = indexOfMovie(CWList, movies[i][0]);
        // if a movie is finished and it is in cw list
        if (movies[i][1] === 1 && movieIndex !== -1) {
          // delete finished movie
          CWList.splice(movieIndex, 1);
        // if a movie is in cw list but still not finished
        } else if (movieIndex !== -1) {
          // update progress
          CWList[movieIndex].progress = movies[i][1];
        } else {
          // look up movie by id and add formatted movie obj to end of cw list
        }
      }
      // only store up to 20 movies in cw list
      // if cw.length > 20
        // set cw to 20 most recent movies => cw.slice(length - 20)
    })
    // .then((test) => {
    //   console.log('test:', test);
    // })
    .catch((err) => {
      throw err;
    });
};

calculateCW(1000, [[100, 0.9], [200, 1], [300, 0.5]]);

module.exports = calculateCW;
