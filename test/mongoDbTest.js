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
  it('should contain at least 1,000,000 users', (done) => {
    mongoDb.UserMovies.count()
      .then((count) => {
        const isBigEnough = count >= 1000000;
        isBigEnough.should.equal(true);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each user should have a recs list', (done) => {
    mongoDb.UserMovies.findById(id)
      .then((result) => {
        result.recs.should.be.a('array');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each user should have a cw list', (done) => {
    mongoDb.UserMovies.findById(id)
      .then((result) => {
        result.cw.should.be.a('array');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });
});

describe('GenreRec', () => {
  it('should only contain 15 documents', (done) => {
    mongoDb.GenreRec.count()
      .then((count) => {
        count.should.equal(15);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each document should have a genre property', (done) => {
    mongoDb.GenreRec.findOne({
      genre: genreArr[genre],
    })
      .then((result) => {
        result.genre.should.be.a('string');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each document should have a recs property', (done) => {
    mongoDb.GenreRec.findOne({
      genre: genreArr[genre],
    })
      .then((result) => {
        result.recs.should.be.a('array');
      })
      .catch((err) => {
        done(err);
      });
    done();
  });

  it('each document should have a createdAt property', (done) => {
    mongoDb.GenreRec.findOne({
      genre: genreArr[genre],
    })
      .then((result) => {
        should.exist(result.createdAt);
      })
      .catch((err) => {
        done(err);
      });
    done();
  });
});
