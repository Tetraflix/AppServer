const express = require('express');
const pgDummyData = require('../postgresDb/dummyData.js');
const mgDummyData = require('../mongoDb/dummyData.js');
const mongoDb = require('../mongoDb/index.js');
const postgresDb = require('../postgresDb/index.js');
const client = require('../dashboard/index.js');
const bodyParser = require('body-parser');
const calculateCW = require('../scripts/calculateCW.js');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  // listening on port 3000
});

app.get('/tetraflix/recommendations/:user', (req, res) => {
  const { user } = req.params;
  mongoDb.UserMovies.findById(user).exec()
    .then((result) => {
      client.index({
        index: 'user-data',
        type: 'user',
        body: {
          user,
          date: new Date(),
        },
      });
      return result;
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw error;
    });
});

app.get('/tetraflix/genre/:genre', (req, res) => {
  // genre recs are not user-specific
  const { genre } = req.params;
  mongoDb.GenreRec.findOne({ genre }).exec()
    .then((result) => {
      client.index({
        index: 'genre-data',
        type: 'genre',
        body: {
          genre,
          date: new Date(),
        },
      });
      return result;
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw error;
    });
});

app.post('/tetraflix/sessionData', (req, res) => {
  const { events } = req.body;
  const movies = [];
  events.forEach((event) => {
    movies.push([event.movie.id, event.progress]);
    if (event.progress === 1) {
      postgresDb.Movie.increment('views', { where: { id: event.movie.id } })
        .catch((err) => {
          throw err;
        });
    }
  });
  // calculateCW(userId, movies);
  res.sendStatus(201);
});

app.get('/tetraflix/dummyData/movies', (req, res) => {
  pgDummyData();
  res.send('adding movies...');
});

app.get('/tetraflix/dummyData/userMovies', (req, res) => {
  mgDummyData();
  res.send('adding user...');
});
