const Sequelize = require('sequelize');
const credentials = require('./credentials/credentials.js');

let movieDb;

if (process.env.DATABASE_URL) {
  movieDb = new Sequelize(process.env.DATBASE_URL);
} else {
  movieDb = new Sequelize({
    database: 'movies',
    username: credentials.username,
    password: credentials.password,
    dialect: 'postgres',
  });
}

movieDb
  .authenticate()
  .then(() => {
    console.log('Successful connection to movies database');
  })
  .catch((err) => {
    console.error('Unable to connect to movies database', err);
  });

// movies database movie schema
const Movie = movieDb.define('movie', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  views: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  profile: {
    type: Sequelize.JSON,
  },
});

// movies database stats schema
// views per day by genre
const Stats = movieDb.define('stats', {
  genre: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATEONLY,
  },
  totalDayViews: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

Movie.sync()
  .then(() => Stats.sync())
  .catch(error => console.log('error syncing data', error));

Module.exports = {
  Sequelize,
  movieDB,
  Movie,
  Stats,
};
