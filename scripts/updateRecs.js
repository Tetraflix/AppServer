const mongoDb = require('../mongoDb/index.js');
const postgresDb = require('../postgresDb/index.js');

const updateRecs = (userId, recArr) =>
  postgresDb.Movie.findAll({
    where: {
      id: recArr,
    },
  })
    .then((recs) => {
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
      return mongoDb.UserMovies.update({ _id: userId }, { $set: { recs: newRecs } }).exec();
    })
    .catch((err) => {
      throw err;
    });

module.exports = updateRecs;
