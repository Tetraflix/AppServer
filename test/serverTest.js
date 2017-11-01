const chai = require('chai');
const chaiHttp = require('chai-http');
require('../server/index.js');

const should = chai.should();
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
        // console.log(userMovies);
        userMovies._id.should.equal(id);
        userMovies.cw.should.be.a('array');
        userMovies.recs.should.be.a('array');
        done();
      });
  });
});
