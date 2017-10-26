const mongoDb = require('./index.js');

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
  userID: 10001,
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

// generate random userId between 1 and 2000000
// generate array of 20 random numbers between 1 and 300000
// for each number, look up the movie with that id in postgres db
// format movie object and push to a new recs array
// if user exists, update user recs
// else create user row with current recs and empty cw array

