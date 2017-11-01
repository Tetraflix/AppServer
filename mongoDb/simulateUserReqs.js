const request = require('request');

const reqUserMovies = () => {
  request.get(`http://localhost:3000/tetraflix/recommendations/${Math.floor(Math.random() * 1000000)}`);
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
