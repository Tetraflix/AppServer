const postgresDb = require('../postgresDb/index.js');
const mongoDb = require('../mongoDb/index.js');

const getMostPopularByGenre = (genre) => {
  postgresDb.Movie.findAll({
    // find top 1000 movies by view count
    order: [['views', 'DESC']],
    limit: 1000,
  })
    .then(result => (
      // return [[movieId, score],...]
      result.map((movie) => {
        const m = movie.dataValues;
        const prof = JSON.parse(m.profile);
        return [m.id, m.views * prof[genre]];
      })
    ))
    .then(scores => (
      // sort scores in descending order
      scores.sort((a, b) => {
        if (a[1] > b[1]) {
          return -1;
        } else if (a[1] < b[1]) {
          return 1;
        }
        return 0;
      })
    ))
    .then((scoresDesc) => {
      // return array of top 20 movieIds
      const mostPopularIds = [];
      for (let i = 0; i < 20; i += 1) {
        mostPopularIds.push(scoresDesc[i][0]);
      }
      return mostPopularIds;
    })
    .then(ids => (
      // look up movies by ids
      postgresDb.Movie.findAll({
        where: {
          id: ids,
        },
      })
    ))
    .then((results) => {
      return results.map(result => result.dataValues)
    })
    .then((formatted) => {
      formatted.forEach((movieObject) => {
        movieObject.profile = JSON.parse(movieObject.profile);
      });
      // update database with new genre recs
      mongoDb.GenreRec.findOneAndUpdate(
        {
          genre,
        },
        {
          $setOnInsert:
          {
            genre,
          },
          $set: {
            createdAt: new Date(),
            recs: formatted,
          },
        },
        {
          upsert: true,
          new: true,
        },
        (err, doc) => {
          // do something
          if (err) {
            throw err;
          }
        },
      );
    })
    .catch((err) => {
      throw err;
    });
};

getMostPopularByGenre('drama');

// run this query periodically for each genre (every day? x hours?)
