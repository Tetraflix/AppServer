const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoDb = require('../mongoDb/index.js');

const should = chai.should();

chai.use(chaiHttp);

const genreArr = [
  'action',
  'animation',
  'comedy',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'international',
  'horror',
  'musical',
  'mystery',
  'romance',
  'sci_fi',
  'thriller',
  'western',
];
const id = Math.floor(Math.random() * 300000);
const genre = Math.floor(Math.random() * 15);

describe('UserMovies', () => {
  it('should contain at least 1,000,000 users', () => {
    mongoDb.UserMovies.count()
      .then((count) => {
        const isBigEnough = count >= 1000000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        throw err;
      });
  });

  it('each user should have a recs list', () => {
    mongoDb.UserMovies.findById(id, (err, result) => {
      if (err) {
        throw err;
      }
      result.recs.should.be.a('object');
    });
  });

  it('each user should have a cw list', () => {
    mongoDb.UserMovies.findById(id, (err, result) => {
      if (err) {
        throw err;
      }
      result.cw.should.be.a('object');
    });
  });
});

describe('GenreRec', () => {
  it('should only contain 15 documents', () => {
    mongoDb.GenreRec.count()
      .then((count) => {
        count.should.equal(15);
      });
  });

  it('each document should have a genre property', () => {
    mongoDb.UserMovies.findOne({
      where: {
        genre: genreArr[genre],
      },
    })
      .then((result) => {
        result.should.be.a('string');
      });
  });

  it('each document should have a recs property', () => {
    mongoDb.UserMovies.findOne({
      where: {
        genre: genreArr[genre],
      },
    })
      .then((result) => {
        result.recs.should.be.a('array');
      });
  });

  it('each document should have a createdAt property', () => {
    mongoDb.UserMovies.findOne({
      where: {
        genre: genreArr[genre],
      },
    })
      .then((result) => {
        console.log('REEESULT', result);
        result.createdAt.should.be.a('string');
      });
  });
});
