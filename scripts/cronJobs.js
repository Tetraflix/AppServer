const cron = require('node-cron');
const userRecs = require('./simulateUserRecs.js');
const genreRecs = require('./calculateGenreRecs');

// this should run every minute
cron.schedule('* * * * *', () => {
  // I want this to run at a random interval between 50 and 200 ms
  // will this calculate a new random value every minute?
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});

// this should run (on the 59th minute of) every hour
cron.schedule('* 59 * * * *', genreRecs);
