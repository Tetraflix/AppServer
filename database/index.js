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

Movie.sync({ force: true })
  .then(() => Stats.sync())
  .then(() => (
    Movie.create({
      title: 'abcaiuhfgkaj',
      profile: '{"action":11,"animation":7,"comedy":6,"documentary":6,"drama":7,"family":8,"fantasy":5,"international":12,"horror":7,"musical":6,"mystery":0,"romance":12,"sci_fi":8,"thriller":0,"western":5}',
    })
  ))
  .catch(error => console.log('error syncing data', error));

module.exports = {
  Movie,
  Stats,
};
