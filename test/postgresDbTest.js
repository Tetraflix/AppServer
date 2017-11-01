const chai = require('chai');
const chaiHttp = require('chai-http');
const postgresDb = require('../postgresDb/index.js');

const should = chai.should();

chai.use(chaiHttp);

const id = Math.floor(Math.random() * 300000);
const queryById = `select * from movies where id = ${id}`;

describe('Movies', () => {
  it('should contain at least 300,000 movies', () => {
    postgresDb.movieDb.query('select count(*) from movies')
      .then((result) => {
        const isBigEnough = result[0][0].count >= 300000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        throw err;
      });
  });

  it('each movie should have a title', () => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const { title } = result[0][0];
        title.should.be.a('string');
      });
  });

  it('each movie should have a view count', () => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const { views } = result[0][0];
        views.should.be.a('number');
      });
  });

  it('each movie should have a genre profile', () => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        profile.should.be.a('object');
      });
  });

  it('profile should have 15 genres', () => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        const genreCount = Object.keys(profile).length;
        genreCount.should.equal(15);
      });
  });

  it('profile values should add up to 100', () => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        let profileTotal = 0;
        for (let genre in profile) {
          profileTotal += profile[genre];
        }
        profileTotal.should.equal(100);
      });
  });
});
