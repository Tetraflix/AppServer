const express = require('express');
const pgDummyData = require('../postgresDb/dummyData.js');
const mgDummyData = require('../mongoDb/dummyData.js');
const mongoDb = require('../mongoDb/index.js');
const client = require('../dashboard/index.js');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  // listening on port 3000
});

app.get('/tetraflix/recommendations/:user', (req, res) => {
  const { user } = req.params;
  mongoDb.UserMovies.findById(user, (err, doc) => {
    if (err) {
      throw err;
    } else {
      client.index({
        index: 'data',
        type: 'user',
        body: {
          user,
        },
      })
        .then(() => {
          res.send(doc);
        });
    }
  });
});

app.get('/tetraflix/genre/:genre', (req, res) => {
  // genre recs are not user-specific
  const { genre } = req.params;
  mongoDb.GenreRec.findOne({ where: { genre } }, (err, doc) => {
    if (err) {
      throw err;
    } else {
      client.index({
        index: 'data',
        type: 'user',
        body: {
          genre,
        },
      })
        .then(() => {
          res.send(doc);
        });
    }
  });
});

app.get('/tetraflix/dummyData/movies', (req, res) => {
  pgDummyData();
  res.send('adding movies...');
});

app.get('/tetraflix/dummyData/userMovies', (req, res) => {
  mgDummyData();
  res.send('adding user...');
});

// app.get('/tetraflix/testing', (req, res) => {
//   console.log('inside server');
//   res.send('testing, testing, testing');
// });
