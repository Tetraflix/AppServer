const chai = require('chai');
const chaiHttp = require('chai-http');
require('../server/index.js');

const should = chai.should();
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
const genre = Math.floor(Math.random() * 15);
const id = Math.floor(Math.random() * 300000);

chai.use(chaiHttp);

describe('server', () => {
  it('should return recs and cw for a user', (done) => {
    chai.request('http://localhost:3000')
      .get(`/tetraflix/recommendations/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.a('string');
        const userMovies = JSON.parse(res.text);
        userMovies.cw.should.be.a('array');
        userMovies.recs.should.be.a('array');
        done();
      });
  });

  it('should return top genre recs', (done) => {
    chai.request('http://localhost:3000')
      .get(`/tetraflix/genre/${genreArr[genre]}`)
      .end((err, res) => {
        res.should.have.status(200);
        const genreMovies = JSON.parse(res.text);
        genreMovies.recs.should.be.a('array');
        done();
      });
  });
});
