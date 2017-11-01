const cron = require('node-cron');
const userRecs = require('./simulateUserRecs.js');
const genreRecs = require('./calculateGenreRecs');

const rand = () => Math.floor(Math.random() * 150) + 50;

// simultate GET requests for individual user recommendations
for (let i = 0; i < 10; i += 1) {
  cron.schedule('* * * * *', () => {
    setInterval(userRecs, rand());
  });
}

// update genre recommendations every hour
cron.schedule('* 59 * * * *', genreRecs);
