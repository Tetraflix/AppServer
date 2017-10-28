const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoDb = require('../mongoDb/index.js');

const should = chai.should();

chai.use(chaiHttp);

const id = Math.floor(Math.random() * 300000);

describe('UserMovies', () => {

  it('should contain at least 1,000,000 users', () => {
    mongoDb.UserMovies.count({}, (err, result) => {
    })
      .then((count) => {
        const isBigEnough = count >= 1000000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('each user should have a recs list', () => {
    mongoDb.UserMovies.findById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      result.recs.should.be.a('object');
    });
  });

  it('each user should have a cw list', () => {
    mongoDb.UserMovies.findById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      result.cw.should.be.a('object');
    });
  });

});