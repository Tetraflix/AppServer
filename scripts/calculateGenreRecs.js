const postgresDb = require('../postgresDb/index.js');
const mongoDb = require('../mongoDb/index.js');

const genreArr = [
  'action',
  'animation',
  'comedy',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'international',
  'horror',
  'musical',
  'mystery',
  'romance',
  'sci_fi',
  'thriller',
  'western',
];

const updateGenreRecs = (genre) => {
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
    .then((sortedDesc) => {
      // return array of top 20 movieIds
      const mostPopularIds = [];
      for (let i = 0; i < 20; i += 1) {
        mostPopularIds.push(sortedDesc[i][0]);
      }
      // look up movies by ids
      return postgresDb.Movie.findAll({
        where: {
          id: mostPopularIds,
        },
      });
    })
    .then((results) => {
      // format results
      const formatted = results.map(result => result.dataValues);
      for (let i = 0; i < formatted.length; i += 1) {
        formatted[i].profile = JSON.parse(formatted[i].profile);
      }
      return formatted;
    })
    .then((recs) => {
      // update database with new genre recs
      const conditions = { genre };
      const update = {
        $setOnInsert: {
          genre,
        },
        $set: {
          createdAt: new Date(),
          recs,
        },
      };
      const options = {
        upsert: true,
        new: true,
      };
      const cb = (err, doc) => {
        if (err) {
          throw err;
        }
        return doc;
      };
      mongoDb.GenreRec.findOneAndUpdate(conditions, update, options, cb);
    })
    .catch((err) => {
      throw err;
    });
};

const updateAllGenreRecs = (genres) => {
  genres.forEach(genre => updateGenreRecs(genre));
};

module.exports = () => updateAllGenreRecs(genreArr);
