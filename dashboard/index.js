const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

client.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    throw error;
  }
});

module.exports = client;
