const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index.js');
const postgresDb = require('../postgresDb/index.js');

const should = chai.should();

chai.use(chaiHttp);

const id = Math.floor(Math.random() * 300000);

describe('Movies', () => {
  // it('testing', (done) => {
  //   chai.request('http://localhost:3000')
  //     .get('/tetraflix/testing')
  //     .end((err, res) => {
  //       console.log(res.text);
  //       res.should.have.status(200);
  //       res.text.should.be.a('string');
  //       res.text.should.equal('testing, testing, testing');
  //       done();
  //     });
  // });

  it('should contain at least 300,000 movies', () => {
    postgresDb.movieDb.query('select count(*) from movies')
      .then((result) => {
        const isBigEnough = result[0][0].count >= 300000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('each movie should have a title', () => {
    // const queryString = 'select * from movies where id = ' + id;
    postgresDb.movieDb.query('select * from movies where id = ' + id)
      .then((result) => {
        const title = result[0][0].title;
        title.should.be.a('string');
      });
  });

  it('each movie should have a view count', () => {
    // const queryString = 'select * from movies where id = ' + id;
    postgresDb.movieDb.query('select * from movies where id = ' + id)
      .then((result) => {
        const views = result[0][0].views;
        views.should.be.a('number');
      });
  });

  it('each movie should have a genre profile', () => {
    // const queryString = 'select * from movies where id = ' + id;
    postgresDb.movieDb.query('select * from movies where id = ' + id)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        profile.should.be.a('object');
      });
  });

  it('profile should have 15 genres', () => {
    // const queryString = 'select * from movies where id = ' + id;
    postgresDb.movieDb.query('select * from movies where id = ' + id)
      .then((result) => {
        const profile = JSON.parse(result[0][0].profile);
        const genreCount = Object.keys(profile).length;
        genreCount.should.equal(15);
      });
  });

  it('profile values should add up to 100', () => {
    // const queryString = 'select * from movies where id = ' + id;
    postgresDb.movieDb.query('select * from movies where id = ' + id)
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
