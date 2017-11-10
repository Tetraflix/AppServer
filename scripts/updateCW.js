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

const updateCW = (userId, movies) => {
  // retrieve user's currently watching list
  let CWList;
  const prog = [];
  const query = mongoDb.UserMovies.findById(userId);
  return query.select('cw')
    .then((queryResult) => {
      CWList = queryResult.cw;
      const results = [];
      // for each movie from session events data
      for (let i = 0; i < movies.length; i += 1) {
        const movieIndex = indexOfMovie(CWList, movies[i][0]);
        // if movie is finished and in cw list
        if (movies[i][1] === 1 && movieIndex !== -1) {
          // delete finished movie
          CWList.splice(movieIndex, 1);
        // if movie is not finished and in cw list
        } else if (movies[i][1] !== 1 && movieIndex !== -1) {
          // update progress and move to end of list
          CWList[movieIndex].progress = movies[i][1];
          const updated = CWList[movieIndex];
          CWList.splice(movieIndex, 1);
          CWList.push(updated);
        // if movie is not finished and not in cw list
        } else if (movies[i][1] !== 1 && movieIndex === -1) {
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
      // limit cw list to 20 items
      if (CWList.length > 20) {
        CWList = CWList.slice(CWList.length - 20);
      }
      // update cw list in mongoDb
      return mongoDb.UserMovies.update({ _id: userId }, { $set: { cw: CWList } }).exec();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = updateCW;
