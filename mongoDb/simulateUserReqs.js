const request = require('request');

// const user = Math.floor(Math.random() * 1000000);

const reqUserMovies = () => {
  request.get(`http://localhost:3000/tetraflix/recommendations/${Math.floor(Math.random() * 1000000)}`);
  // request.get({
  //   uri: `localhost:3000/tetraflix/recommendations/${user}`,
  // }, (error, response, body) => {
  //   if (error) {
  //     throw error;
  //   }
  // });
};

setInterval(reqUserMovies, Math.floor(Math.random() * 100));
setInterval(reqUserMovies, Math.floor(Math.random() * 500));
setInterval(reqUserMovies, Math.floor(Math.random() * 800));
setInterval(reqUserMovies, Math.floor(Math.random() * 1000));
setInterval(reqUserMovies, Math.floor(Math.random() * 1000));
setInterval(reqUserMovies, Math.floor(Math.random() * 1000));
setInterval(reqUserMovies, Math.floor(Math.random() * 2000));
setInterval(reqUserMovies, Math.floor(Math.random() * 3000));
setInterval(reqUserMovies, Math.floor(Math.random() * 5000));
setInterval(reqUserMovies, Math.floor(Math.random() * 10000));
setInterval(reqUserMovies, Math.floor(Math.random() * 10000));
setInterval(reqUserMovies, Math.floor(Math.random() * 10000));
setInterval(reqUserMovies, Math.floor(Math.random() * 10000));
setInterval(reqUserMovies, Math.floor(Math.random() * 10000));
