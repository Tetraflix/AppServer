const request = require('request');

module.exports = () => {
  request.get(`http://localhost:3000/tetraflix/recommendations/${Math.floor(Math.random() * 1000000)}`);
};
