const movies = require('../postgresDb/index.js');
const sequelize = require('sequelize');

const getMostPopularByGenre = (genre) => {
  movies.Movie.findAll({
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
    .then((scores) => {
      // sort scores in descending order
      return scores.sort((a, b) => {
        if (a[1] > b[1]) {
          return -1;
        } else if (a[1] < b[1]) {
          return 1;
        } else {
          return 0;
        }
      });
    })
    .then((scoresDesc) => {
      // return array of top 20 movieIds
      const mostPopularIds = [];
      for (let i = 0; i < 20; i += 1) {
        mostPopularIds.push(scoresDesc[i][0]);
      }
      return mostPopularIds;
    })
    .then((ids) => {
      // look up movies by ids
      console.log(ids);
    })
    .then((results) => {
      // format results
      console.log(results);
    })
    .then((formatted) => {
      // update database with new genre recs
      console.log(formatted);
    })
    .catch((err) => {
      throw err;
    });
};

getMostPopularByGenre('action');

// run this query periodically for each genre (every day? x hours?)
