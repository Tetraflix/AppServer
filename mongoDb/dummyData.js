const mongoDb = require('./index.js');
const postgresDb = require('../postgresDb/index.js');

const getMovieInfoById = arr => (
  postgresDb.Movie.findAll({
    where: {
      id: arr,
    },
  })
);

let counter = 0;
const userMovieObjs = [];

const addUserMovies = () => {
  const ids = [];
  for (let i = 0; i < 40; i += 1) {
    ids.push(Math.floor(Math.random() * 300000));
  }
  // get info for 40 movies at a time (instead of 20 * 2)
  getMovieInfoById(ids)
    .then((results) => {
      // format all results at once instead of recs and cw separately
      // eliminates a lot of repeated code
      const movies = results.map((result, i) => {
        const movie = result.dataValues;
        const prog = i < 20 ? 0 : (Math.floor(Math.random() * 100)) / 100;
        const prof = JSON.parse(movie.profile);
        return {
          movieId: movie.id,
          title: movie.title,
          views: movie.views,
          progress: prog,
          profile: prof,
        };
      });
      const recs = movies.slice(0, 20);
      const cw = movies.slice(20, 40);
      userMovieObjs.push({
        '_.id': counter,
        recs,
        cw,
      });
      if (counter < 10000) {
        counter += 1;
        addUserMovies();
      } else {
        console.log(userMovieObjs.length);
        // console.log(userMovieObjs);
        // console.log(userMovieObjs[0].cw[0]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

addUserMovies();

//     .then(() => {
//       counter += 1;
//       if (counter < 3000010) {
//         addUserMovies();
//       } else {
//         console.log('Length: ', userMovieObjs.length);
//         mongoDb.UserMovies.insertMany(userMovieObjs);
//       }
//     })
//     // .then(() => {
//       // console.log('movie object example: ', userMovieObjs[0]);
//       // mongoDb.UserMovies.insertMany(userMovieObjs);
//     // })
//     // .then((formattedData) => {
//     //   // create new userMovies object
//     //   const newUser = new mongoDb.UserMovies({
//     //     _id: counter,
//     //     recs: formattedData[0],
//     //     cw: formattedData[1],
//     //   });
//     //   newUser.save((error) => {
//     //     if (error) {
//     //       throw error;
//     //     }
//     //   });
//     // })
//     .catch((error) => {
//       throw error;
//     });
// };

// const addUserMovies = () => {
//   const userMovieObjs = [];
//   const movies1 = [];
//   const movies2 = [];
//   for (let i = 0; i < 20; i += 1) {
//     // small chance of duplicate movies okay for dummy data
//     movies1.push(Math.floor(Math.random() * 300000));
//     movies2.push(Math.floor(Math.random() * 300000));
//   }
//   Promise.all([generateRecs(movies1), generateCW(movies2)])
//     .then((results) => {
//       // format recs
//       const recs = results[0];
//       const newRecs = [];
//       recs.forEach((rec) => {
//         const recObj = rec.dataValues;
//         const prof = JSON.parse(recObj.profile);
//         const newRec = {
//           movieId: recObj.id,
//           title: recObj.title,
//           views: recObj.views,
//           progress: 0,
//           profile: prof,
//         };
//         newRecs.push(newRec);
//       });
//       // format cw
//       const cws = results[1];
//       const newCWs = [];
//       cws.forEach((cw) => {
//         const cwObj = cw.dataValues;
//         const prof = JSON.parse(cwObj.profile);
//         const newCW = {
//           movieId: cwObj.id,
//           title: cwObj.title,
//           views: cwObj.views,
//           progress: (Math.floor(Math.random() * 100)) / 100,
//           profile: prof,
//         };
//         newCWs.push(newCW);
//       });
//       // return [newRecs, newCWs];
//       const newUser = {
//         '_.id': counter,
//         recs: newRecs,
//         cw: newCWs,
//       };
//       userMovieObjs.push(newUser);
//     })
//     .then(() => {
//       counter += 1;
//       if (counter < 3000010) {
//         addUserMovies();
//       } else {
//         console.log('Length: ', userMovieObjs.length);
//         mongoDb.UserMovies.insertMany(userMovieObjs);
//       }
//     })
//     // .then(() => {
//       // console.log('movie object example: ', userMovieObjs[0]);
//       // mongoDb.UserMovies.insertMany(userMovieObjs);
//     // })
//     // .then((formattedData) => {
//     //   // create new userMovies object
//     //   const newUser = new mongoDb.UserMovies({
//     //     _id: counter,
//     //     recs: formattedData[0],
//     //     cw: formattedData[1],
//     //   });
//     //   newUser.save((error) => {
//     //     if (error) {
//     //       throw error;
//     //     }
//     //   });
//     // })
//     .catch((error) => {
//       throw error;
//     });
// };

module.exports = addUserMovies;
