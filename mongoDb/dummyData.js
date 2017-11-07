const mongoDb = require('./index.js');
const postgresDb = require('../postgresDb/index.js');

// seed user movies table with users, recommended and currently watching movies

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
  const movies1 = [];
  const movies2 = [];
  for (let i = 0; i < 20; i += 1) {
    // small chance of duplicate movies okay for dummy data
    movies1.push(Math.floor(Math.random() * 300000));
    movies2.push(Math.floor(Math.random() * 300000));
  }
  Promise.all([generateRecs(movies1), generateCW(movies2)])
    .then((results) => {
      // format recs
      const recs = results[0];
      const newRecs = [];
      recs.forEach((rec) => {
        const recObj = rec.dataValues;
        const prof = JSON.parse(recObj.profile);
        const newRec = {
          movieId: recObj.id,
          title: recObj.title,
          views: recObj.views,
          progress: 0,
          profile: prof,
        };
        newRecs.push(newRec);
      });
      // format cw
      const cws = results[1];
      const newCWs = [];
      cws.forEach((cw) => {
        const cwObj = cw.dataValues;
        const prof = JSON.parse(cwObj.profile);
        const newCW = {
          movieId: cwObj.id,
          title: cwObj.title,
          views: cwObj.views,
          progress: (Math.floor(Math.random() * 100)) / 100,
          profile: prof,
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
      if (counter <= 1000000) {
        addUserMovies();
      }
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = addUserMovies;
