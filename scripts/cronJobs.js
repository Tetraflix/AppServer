const cron = require('node-cron');
const request = require('request');
const genreRecs = require('./calculateGenreRecs.js');

// update genre recommendations every hour
cron.schedule('* 59 * * * *', genreRecs);

// simulate GET requests for individual user recommendations
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 175) + 25;
  for (let i = 0; i < rand; i += 1) {
    request.get(`http://localhost:3000/tetraflix/recommendations/${Math.floor(Math.random() * 1000000)}`);
  }
});

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
// simulate GET requests for genre recommendations
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 175) + 25;
  for (let i = 0; i < rand; i += 1) {
    request.get(`http://localhost:3000/tetraflix/genre/${genreArr[Math.floor(Math.random() * 15)]}`);
  }
});

// simulate processing session data
// update movie view counts and currently watching for users

// simulate updating genre recommendations
const updateUserRecs = () => {
  const recs = [];
  for (let i = 0; i < 20; i += 1) {
    recs.push(Math.floor(Math.random() * 300000));
  }
  const recsData = {
    userId: Math.floor(Math.random() * 1000000),
    rec: recs,
  };
  const options = {
    url: 'http://localhost:3000/tetraflix/userRecs',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: recsData,
    json: true,
  };
  request(options, (error, response, body) => {
    if (error) {
      throw error;
    }
  });
};

cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 175) + 25;
  for (let i = 0; i < rand; i += 1) {
    updateUserRecs();
  }
});
