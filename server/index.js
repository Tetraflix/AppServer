const express = require('express');
const dummyData = require('../postgresDb/dummyData.js');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

app.get('/tetraflix/recommendations/:user', (req, res) => {
  const user = req.params.user;

  // look up recs and cw for user by ID
  // something like: queryResult = findOne({ where: { user: user} });

  // very simplified result; actual will contain 20 recommendation
  // and some number of currently watching movie objects (up to 20?);
  const queryResult = '"{"recommendations":[{"id":8675309,"title":"Lord of the Rings","profile":{"action":30,"adventure":40,"fantasy":30},"progress":0},{"id":4879823,"title":"Finding Nemo","profile":{"animation":60,"family":40},"progress":0}],"currentlyWatching":[{"id":234523,"title":"Shrek","profile":{"animation":40,"comedy":30,"family":30},"progress":0.3},{"id":857636,"title":"Lego Batman","profile":{"action":30,"animation":40,"comedy":30},"progress":0.7}]}"';
  res.send(queryResult);
});

app.get('/tetraflix/genre/:genre', (req, res) => {
  // genre recs are not user-specific
  const genre = req.params.genre;

  // look up recs by genre
  // something like: queryResult = findOne({ where: { genre: genre } });

  // very simplified result; actual will contain 20 movie objects
  const queryResult = '"{"genre":[{"id":34532,"title":"Spider Man","profile":{"action":80,"comedy":20},"progress":0},{"id":567490,"title":"Star Wars","profile":{"action":70,"fantasy":30},"progress":0}]}"';
  res.send(queryResult);
});

app.get('/tetraflix/dummyData/movies', (req, res) => {
  dummyData();
  res.send('adding movies...');
});
