const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index.js');
const postgresDb = require('../postgresDb/index.js');

const should = chai.should();

chai.use(chaiHttp);

describe('Movies', () => {
  it('testing', (done) => {
    chai.request('http://localhost:3000')
      .get('/tetraflix/testing')
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.text.should.be.a('string');
        res.text.should.equal('testing, testing, testing');
        done();
      });
  });
});
