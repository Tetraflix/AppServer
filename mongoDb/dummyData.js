const postgresDb = require('../postgresDb/index.js');
const fs = require('fs');

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
  getMovieInfoById(ids)
    .then((results) => {
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
        _id: counter,
        recs,
        cw,
      });
      if (counter < 100000) {
        counter += 1;
        addUserMovies();
      } else {
        const wstream = fs.createWriteStream('usermovies0_output.json');
        wstream.write('[');
        userMovieObjs.forEach(obj => wstream.write(`${JSON.stringify(obj)},`));
        wstream.end();
        console.log('finished writing file: ');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

addUserMovies();

// bash command for inserting files into mongo:
// mongoimport --jsonArray --db tetraflix --collection usermovies --file ~/usermovies0_output.json;
