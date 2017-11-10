const express = require('express');
const pgDummyData = require('../postgresDb/dummyData.js');
const mongoDb = require('../mongoDb/index.js');
const postgresDb = require('../postgresDb/index.js');
const client = require('../dashboard/index.js');
const bodyParser = require('body-parser');
const updateCW = require('../scripts/updateCW.js');
const updateRecs = require('../scripts/updateRecs.js');
const AWS = require('aws-sdk');
const path = require('path');
const cron = require('node-cron');

AWS.config.loadFromPath(path.resolve(__dirname, './config.json'));
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queues = {
  sessionData: 'https://sqs.us-east-2.amazonaws.com/014428875390/sessionData.fifo',
  userRecs: 'https://sqs.us-east-2.amazonaws.com/014428875390/userRecs.fifo',
};

const sendMessages = options => (
  new Promise((resolve, reject) => {
    sqs.sendMessage(options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
);

const receiveMessages = options => (
  new Promise((resolve, reject) => {
    sqs.receiveMessage(options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
);

const deleteMessage = options => (
  new Promise((resolve, reject) => {
    sqs.deleteMessage(options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
);

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  // listening on port 3000
});

app.get('/tetraflix/recommendations/:user', (req, res) => {
  const { user } = req.params;
  mongoDb.UserMovies.findById(user).exec()
    .then((result) => {
      client.index({
        index: 'user-data',
        type: 'user',
        body: {
          user,
          date: new Date(),
        },
      });
      return result;
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw error;
    });
});

app.get('/tetraflix/genre/:genre', (req, res) => {
  // genre recs are not user-specific
  const { genre } = req.params;
  mongoDb.GenreRec.findOne({ genre }).exec()
    .then((result) => {
      client.index({
        index: 'genre-data',
        type: 'genre',
        body: {
          genre,
          date: new Date(),
        },
      });
      return result;
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw error;
    });
});

const receiveSessionData = () => {
  let deleteId;
  let user;
  const movies = [];
  const sessionDataOptions = {
    QueueUrl: queues.sessionData,
  };
  receiveMessages(sessionDataOptions)
    .then((data) => {
      if (!data || !data.Messages) {
        throw new Error('No messages to receive');
      } else {
        const message = JSON.parse(data.Messages[0].Body);
        const { events } = message;
        user = message.userId;
        deleteId = data.Messages[0].ReceiptHandle;
        events.forEach((event) => {
          movies.push([event.movie.id, event.progress]);
          if (event.progress === 1) {
            postgresDb.Movie.increment('views', { where: { id: event.movie.id } })
              .catch((err) => {
                throw err;
              });
          }
        });
        return updateCW(user, movies);
      }
    })
    .then(() => {
      client.index({
        index: 'session-data',
        type: 'session',
        body: {
          user,
          movies: movies.length,
          date: new Date(),
        },
      });
      const deleteOptions = {
        QueueUrl: queues.sessionData,
        ReceiptHandle: deleteId,
      };
      deleteMessage(deleteOptions);
    })
    .catch((error) => {
      console.log(error);
    });
};

cron.schedule('*/1 * * * * *', receiveSessionData);

const receiveUserRecs = () => {
  let deleteId;
  let user;
  const userRecsOptions = {
    QueueUrl: queues.userRecs,
  };
  receiveMessages(userRecsOptions)
    .then((data) => {
      if (!data || !data.Messages) {
        throw new Error('No messages to receive');
      } else {
        const recs = data.Messages[0].Body.rec;
        deleteId = data.Messages[0].ReceiptHandle;
        user = data.Messages[0].Body.userId;
        return updateRecs(user, recs);
      }
    })
    .then(() => {
      client.index({
        index: 'recs-data',
        type: 'recs',
        body: {
          user,
          date: new Date(),
        },
      });
      const deleteOptions = {
        QueueUrl: queues.userRecs,
        ReceiptHandle: deleteId,
      };
      deleteMessage(deleteOptions);
    })
    .catch((error) => {
      console.log(error);
    });
};

cron.schedule('*/1 * * * * *', receiveUserRecs);

app.get('/tetraflix/dummyData/movies', (req, res) => {
  pgDummyData();
  res.send('adding movies...');
});

module.exports = {
  sendMessages,
  queues,
};
