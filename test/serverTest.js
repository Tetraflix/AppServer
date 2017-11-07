const chai = require('chai');
const chaiHttp = require('chai-http');
const postgresDb = require('../postgresDb/index.js');
const mongoDb = require('../mongoDb/index.js');
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


describe('Personalized Recommendations', () => {
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
});


describe('Genre Recommendations', () => {
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


describe('View Count', () => {
  it('should update view count when progress equals one', (done) => {
    const movieId = Math.floor(Math.random() * 300000);
    const getViews = `select views from movies where id = ${movieId}`;
    let viewsBefore;
    let viewsAfter;
    postgresDb.movieDb.query(getViews)
      .then((resultBefore) => {
        viewsBefore = resultBefore[0][0].views;
        chai.request('http://localhost:3000')
          .post('/tetraflix/sessionData')
          .set('content-type', 'application/json')
          .send({
            userId: Math.floor(Math.random() * 1000000),
            events: [{
              movie: {
                id: movieId,
              },
              progress: 1,
              timestamp: '2017-09-08 12:50PM',
            }],
          })
          .end((err, res) => {
            if (err) {
              done(err);
            }
            postgresDb.movieDb.query(getViews)
              .then((resultAfter) => {
                viewsAfter = resultAfter[0][0].views;
                viewsAfter.should.equal(viewsBefore + 1);
                done();
              });
          });
      });
  });

  it('should not update view count when progress is less than 1', (done) => {
    const movieId = Math.floor(Math.random() * 300000);
    const getViews = `select views from movies where id = ${movieId}`;
    let viewsBefore;
    let viewsAfter;
    postgresDb.movieDb.query(getViews)
      .then((resultBefore) => {
        viewsBefore = resultBefore[0][0].views;
        chai.request('http://localhost:3000')
          .post('/tetraflix/sessionData')
          .set('content-type', 'application/json')
          .send({
            userId: Math.floor(Math.random() * 1000000),
            events: [{
              movie: {
                id: movieId,
              },
              progress: 0.9,
              timestamp: '2017-09-08 12:50PM',
            }],
          })
          .end((err, res) => {
            if (err) {
              done(err);
            }
            postgresDb.movieDb.query(getViews)
              .then((resultAfter) => {
                viewsAfter = resultAfter[0][0].views;
                viewsAfter.should.equal(viewsBefore);
                done();
              });
          });
      });
  });

  it('should update view count for multiple movies', (done) => {
    const rand = Math.floor(Math.random() * 100000);
    const movie1 = rand;
    const movie2 = rand + 100000;
    const movie3 = rand + 200000;
    const sendObj = {
      userId: Math.floor(Math.random() * 1000000),
      events: [
        {
          movie: {
            id: movie1,
          },
          progress: 1,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie2,
          },
          progress: 1,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie3,
          },
          progress: 0.9,
          timestamp: '2017-09-08 12:50PM',
        },
      ],
    };
    let movie1Before;
    let movie2Before;
    let movie3Before;
    let movie1After;
    let movie2After;
    let movie3After;
    postgresDb.Movie.findAll({
      where: {
        id: [movie1, movie2, movie3],
      },
      order: [
        ['id', 'ASC'],
      ],
    })
      .then((before) => {
        movie1Before = before[0].dataValues.views;
        movie2Before = before[1].dataValues.views;
        movie3Before = before[2].dataValues.views;
        chai.request('http://localhost:3000')
          .post('/tetraflix/sessionData')
          .set('content-type', 'application/json')
          .send(sendObj)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            postgresDb.Movie.findAll({
              where: {
                id: [movie1, movie2, movie3],
              },
              order: [
                ['id', 'ASC'],
              ],
            })
              .then((after) => {
                movie1After = after[0].dataValues.views;
                movie2After = after[1].dataValues.views;
                movie3After = after[2].dataValues.views;
                movie1After.should.equal(movie1Before + 1);
                movie2After.should.equal(movie2Before + 1);
                movie3After.should.equal(movie3Before);
                done();
              });
          });
      });
  });
});


describe('Currently Watching Movie List', () => {
  it('should remove / not add finished movies from cw list', (done) => {
    const rand = Math.floor(Math.random() * 100000);
    const randUser = Math.floor(Math.random() * 1000000);
    const movie1 = rand;
    const movie2 = rand + 100000;
    const sendObj = {
      userId: randUser,
      events: [
        {
          movie: {
            id: movie1,
          },
          progress: 1,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie2,
          },
          progress: 1,
          timestamp: '2017-09-08 12:50PM',
        },
      ],
    };
    chai.request('http://localhost:3000')
      .post('/tetraflix/sessionData')
      .set('content-type', 'application/json')
      .send(sendObj)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          mongoDb.UserMovies.findById(randUser)
            .then((result) => {
              const movies = result.cw.map(movie => movie.movieId);
              movies.indexOf(movie1).should.equal(-1);
              movies.indexOf(movie2).should.equal(-1);
              done();
            })
            .catch((error) => {
              throw error;
            });
        }
      });
  });

  it('should update progress / add movie when progress < 1', (done) => {
    const rand = Math.floor(Math.random() * 100000);
    const randUser = Math.floor(Math.random() * 1000000);
    const movie1 = rand;
    const movie2 = rand + 100000;
    const sendObj = {
      userId: randUser,
      events: [
        {
          movie: {
            id: movie1,
          },
          progress: 0.11,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie2,
          },
          progress: 0.22,
          timestamp: '2017-09-08 12:50PM',
        },
      ],
    };
    chai.request('http://localhost:3000')
      .post('/tetraflix/sessionData')
      .set('content-type', 'application/json')
      .send(sendObj)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          mongoDb.UserMovies.findById(randUser)
            .then((result) => {
              const prog = {};
              result.cw.forEach((movie) => {
                prog[movie.movieId] = movie.progress;
              });
              prog[movie1].should.equal(0.11);
              prog[movie2].should.equal(0.22);
              done();
            })
            .catch((error) => {
              throw error;
            });
        }
      });
  });

  it('should contain 20 movies or fewer', (done) => {
    const rand = Math.floor(Math.random() * 100000);
    const randUser = Math.floor(Math.random() * 1000000);
    const movie1 = rand;
    const movie2 = rand + 100000;
    const movie3 = rand + 200000;
    const sendObj = {
      userId: randUser,
      events: [
        {
          movie: {
            id: movie1,
          },
          progress: 0.11,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie2,
          },
          progress: 0.22,
          timestamp: '2017-09-08 12:50PM',
        },
        {
          movie: {
            id: movie3,
          },
          progress: 0.33,
          timestamp: '2017-09-08 12:50PM',
        },
      ],
    };
    chai.request('http://localhost:3000')
      .post('/tetraflix/sessionData')
      .set('content-type', 'application/json')
      .send(sendObj)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          mongoDb.UserMovies.findById(randUser)
            .then((result) => {
              const movies = result.cw.map(movie => movie.movieId);
              const isProperLength = movies.length <= 20;
              isProperLength.should.equal(true);
              done();
            })
            .catch((error) => {
              throw error;
            });
        }
      });
  });
});
