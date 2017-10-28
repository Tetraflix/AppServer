const express = require('express');
const pgDummyData = require('../postgresDb/dummyData.js');
const mgDummyData = require('../mongoDb/dummyData.js');
const mongoDb = require('../mongoDb/index.js');

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
    res.send(doc);
  });
});

app.get('/tetraflix/genre/:genre', (req, res) => {
  // genre recs are not user-specific
  // const { genre } = req.params;

  // look up recs by genre
  // something like: queryResult = findOne({ where: { genre: genre } });

  // very simplified result; actual will contain 20 movie objects
  const queryResult = '"{"genre":[{"id":34532,"title":"Spider Man","profile":{"action":80,"comedy":20},"progress":0},{"id":567490,"title":"Star Wars","profile":{"action":70,"fantasy":30},"progress":0}]}"';
  res.send(queryResult);
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
