const cron = require('node-cron');
const request = require('request');
const genreRecs = require('./calculateGenreRecs.js');
const dbStats = require('../dbStats.js');

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

const processSessionData = () => {
  const events = [];
  for (let i = 0; i < 5; i += 1) {
    events.push({
      movie: {
        id: Math.floor(Math.random() * dbStats.movies),
      },
      progress: Math.floor(Math.random() * 100) / 100,
      timestamp: new Date(),
    });
  }
  const sessionData = {
    userId: Math.floor(Math.random() * dbStats.users),
    events,
  };
  const options = {
    url: 'http://localhost:3000/tetraflix/sessionData',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: sessionData,
    json: true,
  };
  request(options, (error, response, body) => {
    if (error) {
      throw error;
    }
  });
};

const updateUserRecs = () => {
  const recs = [];
  for (let i = 0; i < 20; i += 1) {
    recs.push(Math.floor(Math.random() * dbStats.movies));
  }
  const recsData = {
    userId: Math.floor(Math.random() * dbStats.users),
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

// CRON JOBS

// update genre recommendations every hour
cron.schedule('* 59 * * * *', genreRecs);

// simulate GET requests for individual user recommendations
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 25) + 5;
  for (let i = 0; i < rand; i += 1) {
    request.get(`http://localhost:3000/tetraflix/recommendations/${Math.floor(Math.random() * dbStats.users)}`);
  }
});

// simulate GET requests for genre recommendations
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 25) + 5;
  for (let i = 0; i < rand; i += 1) {
    request.get(`http://localhost:3000/tetraflix/genre/${genreArr[Math.floor(Math.random() * 15)]}`);
  }
});


// simulate processing session data
// update movie view counts and currently watching for users
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 25) + 5;
  for (let i = 0; i < rand; i += 1) {
    processSessionData();
  }
});


// simulate updating genre recommendations
cron.schedule('* * * * *', () => {
  const rand = Math.floor(Math.random() * 25) + 5;
  for (let i = 0; i < rand; i += 1) {
    updateUserRecs();
  }
});
