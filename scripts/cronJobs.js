const cron = require('node-cron');
const userRecs = require('./simulateUserRecs.js');
const genreRecs = require('./calculateGenreRecs');

// simultate GET requests for individual user recommendations
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});
cron.schedule('* * * * *', () => {
  setInterval(userRecs, Math.floor(Math.random() * 150) + 50);
});

// update genre recommendations every hour
cron.schedule('* 59 * * * *', genreRecs);
