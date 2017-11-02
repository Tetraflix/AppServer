// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const postgresDb = require('../postgresDb/index.js');
// require('../server/index.js');

// const should = chai.should();
// const genreArr = [
//   'action',
//   'animation',
//   'comedy',
//   'documentary',
//   'drama',
//   'family',
//   'fantasy',
//   'international',
//   'horror',
//   'musical',
//   'mystery',
//   'romance',
//   'sci_fi',
//   'thriller',
//   'western',
// ];
// const genre = Math.floor(Math.random() * 15);
// const id = Math.floor(Math.random() * 300000);

// chai.use(chaiHttp);

// describe('Personalized Recommendations', () => {
//   it('should return recs and cw for a user', (done) => {
//     chai.request('http://localhost:3000')
//       .get(`/tetraflix/recommendations/${id}`)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.text.should.be.a('string');
//         const userMovies = JSON.parse(res.text);
//         userMovies.cw.should.be.a('array');
//         userMovies.recs.should.be.a('array');
//         done();
//       });
//   });
// });

// describe('Genre Recommendations', () => {
//   it('should return top genre recs', (done) => {
//     chai.request('http://localhost:3000')
//       .get(`/tetraflix/genre/${genreArr[genre]}`)
//       .end((err, res) => {
//         res.should.have.status(200);
//         const genreMovies = JSON.parse(res.text);
//         genreMovies.recs.should.be.a('array');
//         done();
//       });
//   });
// });

// input: {
//   userId: 534356757834,
//   events: [
//     {
//       movie: {
//         id: 543,
//       },
//       progress: 1,
//       timestamp: '2017-09-08 12:50PM'
//     },
//     {
//       movie: {
//         id: 155,
//       },
//       progress: 0.7,
//       timestamp: '2017-09-08 2:50PM'
//     }
//   ]
// }

// describe('View Count', () => {
//   it('should update view count when progress equals one', (done) => {
//     const movieId = Math.floor(Math.random() * 300000);
//     const getViews = `select views from movies where id = ${movieId}`;
//     let viewsBefore = 0;
//     let viewsAfter = 0;
//     // look up view count of random movie by id
//     postgresDb.movieDb.query(getViews)
//       .then((result) => {
//         viewsBefore = result[0][0].views;
//         console.log('BEFORE', viewsBefore);
//         // make request to increment view count
//         chai.request('http://localhost:3000')
//           .post('/tetraflix/sessionData')
//           .set('content-type', 'application/json')
//           .send({
//             userId: 534356757834,
//             events: [{
//               movie: {
//                 id: movieId,
//               },
//               progress: 1,
//               timestamp: '2017-09-08 12:50PM',
//             }],
//           });
//       })
//       .then(() => {
//         postgresDb.movieDb.query(getViews)
//           .then((result) => {
//             viewsAfter = result[0][0].views;
//             console.log('AFTER', viewsAfter);
//             const didIncrement = viewsAfter === viewsBefore + 1;
//             // didIncrement.should.equal(true);
//           });
//       });
//     done();
//   });

  // it('should not update view count when progress is less than 1', (done) => {
  //   // look up view count of random movie by id
  //   // make request to increment view count
  //   // check that view count was not incremented
  //   done();
  // });

  // it('should update view count for multiple movies', (done) => {
  //   // look up three movies (progress = 1; progress = 1; progress = 0.5)
  //   // make request to increment view count
  //   // check that only correct movies were updated
  //   done();
  // });
// });

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
