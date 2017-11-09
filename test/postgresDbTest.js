const chai = require('chai');
const chaiHttp = require('chai-http');
const postgresDb = require('../postgresDb/index.js');
const dbStats = require('../dbStats.js');

const should = chai.should();

chai.use(chaiHttp);

const id = Math.floor(Math.random() * dbStats.movies);
const queryById = `select * from movies where id = ${id}`;

describe('Movies', () => {
  it('should contain at least 300,000 movies', (done) => {
    postgresDb.movieDb.query('select count(*) from movies')
      .then((result) => {
        const isBigEnough = result[0][0].count >= 300000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each movie should have a title', (done) => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const { title } = result[0][0];
        title.should.be.a('string');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each movie should have a view count', (done) => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const { views } = result[0][0];
        views.should.be.a('number');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each movie should have a genre profile', (done) => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        profile.should.be.a('object');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('profile should have 15 genres', (done) => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        const genreCount = Object.keys(profile).length;
        genreCount.should.equal(15);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('profile values should add up to 100', (done) => {
    postgresDb.movieDb.query(queryById)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        let profileTotal = 0;
        for (let genre in profile) {
          profileTotal += profile[genre];
        }
        profileTotal.should.equal(100);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });
});
