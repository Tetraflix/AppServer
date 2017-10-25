const movies = require('./index.js');


// Helper functions for generating movie objects:

function generateProfileValues() {
  // number of genres to calculate values for (a value between 1 and 14)
  const genreNum = Math.floor(Math.random() * 13) + 1;
  // generate number of random values equal that add up to 100
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
  // add final value so that they add up to 100
  values.push(100 - newTotal);
  return values;
}

function assignProfileValues() {
  // default all values to 0
  const profile = [
    ['action', 0],
    ['animation', 0],
    ['comedy', 0],
    ['documentary', 0],
    ['drama', 0],
    ['family', 0],
    ['fantasy', 0],
    ['international', 0],
    ['horror', 0],
    ['musical', 0],
    ['mystery', 0],
    ['romance', 0],
    ['sci_fi', 0],
    ['thriller', 0],
    ['western', 0],
  ];
  // generate genre profile values with helper function
  const values = generateProfileValues();
  // assign values to genres randomly
  const validIndicies = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  for (let i = 0; i < values.length; i += 1) {
    const index = Math.floor(Math.random() * validIndicies.length);
    const insertIndex = validIndicies[index];
    // remove index from validIndices so that nothing is overwritten
    validIndicies.splice(index, 1);
    profile[insertIndex][1] = values[i];
  }
  // convert profile array to object
  const result = {};
  profile.forEach((genre) => {
    result[genre[0]] = genre[1];
  });
  // return result as JSON string
  return JSON.stringify(result);
}

function generateString() {
  // generate a random string of 20 characters to use as a title
  const chars = 'abcdefghijklmnopqrstuvywxz ';
  const title = [];
  for (let i = 0; i < 20; i += 1) {
    title.push(chars[Math.floor(Math.random() * 27)]);
  }
  return title.join('');
}


// Add movies to movie database
function addDummyData() {
  movies.Movie.create({
    title: generateString(),
    profile: assignProfileValues(),
  });
}

module.exports = addDummyData;
