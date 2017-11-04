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
  let CWList;
  const prog = [];
  const query = mongoDb.UserMovies.findById(userId);
  query.select('cw')
    .then((queryResult) => {
      CWList = queryResult.cw;
      const results = [];
      // for each movie from the session events data
      for (let i = 0; i < movies.length; i += 1) {
        const movieIndex = indexOfMovie(CWList, movies[i][0]);
        // if a movie is finished and it is in cw list
        if (movies[i][1] === 1 && movieIndex !== -1) {
          // delete finished movie
          CWList.splice(movieIndex, 1);
        // if a movie is in cw list but still not finished
        } else if (movieIndex !== -1) {
          // update progress and move to end of list
          CWList[movieIndex].progress = movies[i][1];
          const updated = CWList[movieIndex];
          CWList.splice(movieIndex, 1);
          CWList.push(updated);
        } else {
          // get movie data from postgresDb
          prog.push(movies[i][1]);
          results.push(postgresDb.Movie.findOne({ where: { id: movies[i][0] } }));
        }
      }
      return Promise.all(results);
    })
    .then((movieData) => {
      // add formatted movie objects to end of cw list
      for (let i = 0; i < movieData.length; i += 1) {
        const movieObj = movieData[i].dataValues;
        const profile = JSON.parse(movieObj.profile);
        const formatted = {
          movieId: movieObj.id,
          progress: prog[i],
          title: movieObj.title,
          views: movieObj.views,
          profile,
        };
        CWList.push(formatted);
      }
      // limit the list to 20 items
      if (CWList.length > 20) {
        CWList = CWList.slice(CWList.length - 20);
      }
      // update cw list in mongoDb
      mongoDb.UserMovies.update({ _id: userId }, { $set: { cw: CWList } });
    })
    .catch((err) => {
      throw err;
    });

  // THINGS TO TEST:
  // updates progress if movie exists => yes
  // deletes object if movie is finished => NOOOOO
  // add movie if not finished and not in cw list => yes
  // does not contain more than 20 movies => yes
};

calculateCW(50, [[8068, 0.51], [45441, 0.43], [123456, 1], [8543, 0.01], [22222, 0.94], [37859, 0.58]]);

module.exports = calculateCW;
