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
    logging: false,
  });
}

movieDb
  .authenticate()
  .catch((err) => {
    throw err;
  });

// movies database movie schema
const Movie = movieDb.define('movie', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
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
    type: Sequelize.DATE,
  },
  totalDayViews: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

Movie.sync()
  .then(() => Stats.sync())
  .catch((err) => {
    throw err;
  });

module.exports = {
  movieDb,
  Movie,
  Sequelize,
  Stats,
};
