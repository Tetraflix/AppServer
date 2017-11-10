const movies = require('./index.js');
const dbStats = require('../dbStats.js');

const generateProfileValues = () => {
  const genreNum = Math.floor(Math.random() * 13) + 1;
  const values = [];
  let total = 0;
  for (let i = 0; i < genreNum; i += 1) {
    const newValue = Math.floor(Math.random() * 100);
    values.push(newValue);
    total += newValue;
  }
  let newTotal = 0;
  for (let j = 0; j < values.length; j += 1) {
    const newValue = Math.floor(100 * (values[j] / total));
    values[j] = newValue;
    newTotal += newValue;
  }
  values.push(100 - newTotal);
  return values;
};

const assignProfileValues = () => {
  const profile = {
    action: 0,
    animation: 0,
    comedy: 0,
    documentary: 0,
    drama: 0,
    family: 0,
    fantasy: 0,
    international: 0,
    horror: 0,
    musical: 0,
    mystery: 0,
    romance: 0,
    sci_fi: 0,
    thriller: 0,
    western: 0,
  };

  const genreKeys = [
    'action',
    'animation',
    'comedy',
    'documentary',
    'drama',
    'family',
    'fantasy',
    'international',
    'horror',
    'mystery',
    'romance',
    'sci_fi',
    'thriller',
    'western',
  ];

  const values = generateProfileValues();

  for (let i = 0; i < 14; i += 1) {
    const rand = Math.floor(Math.random() * 14);
    profile[genreKeys[rand]] += values[i];
  }

  return JSON.stringify(profile);
};

const generateString = () => {
  const chars = 'abcdefghijklmnopqrstuvywxz ';
  const title = [];
  for (let i = 0; i < 20; i += 1) {
    title.push(chars[Math.floor(Math.random() * 27)]);
  }
  return title.join('');
};

// generate 300000 movies
module.exports = (i = 0) => {
  movies.Movie.create({
    title: generateString(),
    profile: assignProfileValues(),
    views: Math.floor(Math.random() * dbStats.users),
  })
    .then(() => {
      if (i < 300000) {
        return module.exports(i + 1);
      }
      return i;
    })
    .catch((err) => {
      console.log(err);
    });
};
