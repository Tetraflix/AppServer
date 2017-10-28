const mongoDb = require('./index.js');
const postgresDb = require('../postgresDb/index.js');

// seed user movies table with users, recommended and currently watching movies

// generate 20 movieIds
const movies = [];
for (let i = 0; i < 20; i += 1) {
  // small chance of duplicate movies okay for dummy data
  movies.push(Math.floor(Math.random() * 300000));
}

// retrieve movie objects by id for recs list
const generateRecs = arr => (
  postgresDb.Movie.findAll({
    where: {
      id: arr,
    },
  })
);

// retrieve movie objects by id for cw list
const generateCW = arr => (
  postgresDb.Movie.findAll({
    where: {
      id: arr,
    },
  })
);

let counter = 0;

const addUserMovies = () => {
  Promise.all([generateRecs(movies), generateCW(movies)])
    .then((results) => {
      // format recs
      const recs = results[0];
      const newRecs = [];
      recs.forEach((rec) => {
        const recObj = rec.dataValues;
        const newRec = {
          movieId: recObj.id,
          title: recObj.title,
          views: recObj.views,
          progress: 0,
          profile: recObj.profile,
        };
        newRecs.push(newRec);
      });
      // format cw
      const cws = results[1];
      const newCWs = [];
      cws.forEach((cw) => {
        const cwObj = cw.dataValues;
        const newCW = {
          movieId: cwObj.id,
          title: cwObj.title,
          views: cwObj.views,
          progress: (Math.floor(Math.random() * 100)) / 100,
          profile: cwObj.profile,
        };
        newCWs.push(newCW);
      });
      return [newRecs, newCWs];
    })
    .then((formattedData) => {
      // create new userMovies object
      const newUser = new mongoDb.UserMovies({
        _id: counter,
        recs: formattedData[0],
        cw: formattedData[1],
      });
      newUser.save((error) => {
        if (error) {
          throw error;
        }
      });
    })
    .then(() => {
      counter += 1;
      if (counter < 1000000) {
        addUserMovies();
      }
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = addUserMovies;
