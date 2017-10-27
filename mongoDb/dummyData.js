const mongoDb = require('./index.js');
const postgresDb = require('../postgresDb/index.js');

// seed user movies table with users, recommended and currently watching movies

// generate 20 movieIds
const movies = [];
for (let i = 0; i < 20; i += 1) {
  // small chance of duplicate movies okay for dummy data
  movies.push(Math.floor(Math.random() * 300000));
}

// returns an array of 20 movie objects
// progress is set to 0
function generateRecs(arr) {
  return postgresDb.Movie.findAll({
    where: {
      id: arr,
    },
  })
    .then((results) => {
      const newRecs = [];
      results.forEach((result) => {
        const resultObj = result.dataValues;
        const newRec = {
          movieId: resultObj.id,
          title: resultObj.title,
          views: resultObj.views,
          progress: 0,
          profile: resultObj.profile,
        };
        newRecs.push(newRec);
      });
      console.log(newRecs);
    })
    .catch((err) => {
      console.error(err);
    });
}

generateRecs(movies);

/*

const animation = new mongoDb.GenreRec({
  genre: 'animation',
  createdAt: new Date(),
  recs: [
    {
      movieId: 100000,
      title: 'asdfasdfasf',
      views: 900000,
      profile: {
        action: 0,
        animation: 90,
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
        sci_fi: 10,
        thriller: 0,
        western: 0,
      },
    },
    {
      movieId: 100001,
      title: 'hjklhjklhjkl',
      views: 890001,
      profile: {
        action: 0,
        animation: 90,
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
        sci_fi: 10,
        thriller: 0,
        western: 0,
      },
    },
  ],
});

animation.save((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('saved');
  }
});

const testUser = new mongoDb.UserMovies({
  userId: 10001,
  recs: [
    {
      movieId: 123456,
      title: 'asdfkjafce',
      views: 200000,
      progress: 0,
      profile: {
        action: 0,
        animation: 90,
        comedy: 0,
        documentary: 0,
        drama: 0,
        family: 10,
        fantasy: 0,
        international: 0,
        horror: 0,
        musical: 0,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 0,
        western: 0,
      },
    },
    {
      movieId: 43892,
      title: 'lkjlkjaldfj',
      views: 284934,
      progress: 0,
      profile: {
        action: 0,
        animation: 0,
        comedy: 80,
        documentary: 0,
        drama: 5,
        family: 0,
        fantasy: 5,
        international: 0,
        horror: 5,
        musical: 5,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 0,
        western: 0,
      },
    },
    {
      movieId: 99574,
      title: 'iuer blij',
      views: 784309,
      progress: 0,
      profile: {
        action: 0,
        animation: 0,
        comedy: 0,
        documentary: 0,
        drama: 0,
        family: 0,
        fantasy: 0,
        international: 0,
        horror: 0,
        musical: 50,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 50,
        western: 0,
      },
    },
  ],
  cw: [
    {
      movieId: 123456,
      title: 'lvkjv kijiru',
      views: 77777,
      progress: 0.7,
      profile: {
        action: 60,
        animation: 0,
        comedy: 0,
        documentary: 0,
        drama: 0,
        family: 10,
        fantasy: 0,
        international: 30,
        horror: 0,
        musical: 0,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 0,
        western: 0,
      },
    },
    {
      movieId: 43892,
      title: 'asdfanvjvx',
      views: 284934,
      progress: 0.8,
      profile: {
        action: 0,
        animation: 0,
        comedy: 80,
        documentary: 10,
        drama: 5,
        family: 0,
        fantasy: 0,
        international: 0,
        horror: 5,
        musical: 0,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 0,
        western: 0,
      },
    },
    {
      movieId: 101010,
      title: 'aabbccddee',
      views: 982345,
      progress: 0.4,
      profile: {
        action: 0,
        animation: 0,
        comedy: 0,
        documentary: 0,
        drama: 0,
        family: 0,
        fantasy: 0,
        international: 0,
        horror: 0,
        musical: 50,
        mystery: 0,
        romance: 0,
        sci_fi: 0,
        thriller: 50,
        western: 0,
      },
    },
  ],
});

testUser.save((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('saved');
  }
});

// Update user recommendations simulation

// for the actual implementation:
// get an object in the form { userId: 534356757834, rec: [23, 105, 765, 32, 479] }
// create an empty recs array
// look up movies in postgres database by their ids
// turn the result into a movie object
// (movieId = id; title = title; profile = profile; views = views;  progress = 0)
// push the formatted movie object to the recs array
// check if user already has a row in the users table (lookup by id)
// if user exists, replace old recs with new recs array
// else, create a new row for that user with the current recs array and an empty cw array

// newRecs for user
const newRecs = [];

// generate random userId between 1 and 2000000
const user = Math.floor(Math.random() * 2000000);

// generate array of 20 random numbers between 1 and 300000
const recIds = [];
for (let i = 0; i < 20; i += 1) {
  // there's a small chance the same movie could be recommended twice
  // this is okay for the simulation
  recIds.push(Math.random() * 300000);
}

// for each number, look up the movie with that id in postgres db
function generateMovieObj(i = 0) {
  postgresDb.Movie.find({ id: recIds[i] })
    // format movie object and push to newRecs
    .then((queryResult) => {
      const movieObj = JSON.parse(queryResult);
      const result = {};
      result.movieId = movieObj.id;
      result.title = movieObj.title;
      result.views = movieObj.views;
      result.progress = 0;
      result.profile = movieObj.profile;
      newRecs.push(result);
    })
    .then(() => {
      if (i < 20) {
        return generateMovieObj(i + 1);
      }
      return 'done';
    })
    .then(() => {
      // if user exists, update user recs
      mongoDb.UserMovies.update(
        {
          userId: user,
        },
        {
          recs: newRecs,
        },
        {
          upsert: true,
        },
        (err, res) => {
          if (err) {
            console.error(err);
          }
          return res;
        }
      )
    .catch((err) => {
      console.error(err);
    });
}

// else create user row with current recs and empty cw array => upsert takes care of this?

*/
