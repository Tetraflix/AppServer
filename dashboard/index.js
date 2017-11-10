const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
});

client.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.log(error);
  }
});

module.exports = client;
