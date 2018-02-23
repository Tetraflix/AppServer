# AppServer

## About
* Part of the service oriented architecture for [Tetraflix](https://github.com/Tetraflix), a Netflix clone designed to answer the following business question: Among users who don’t leave ratings, do recommendations based on modeled user genre preferences outperform recommendations based on fixed genre preferences?
* Check out our detailed [App Plan](https://docs.google.com/document/d/1OU61yxLLce3VwlzlenJoszjRqrMK_5IwLJyzvuluo9w/edit?usp=sharing) of the whole system  

## AppServer's role
* Generate and manage inventory of 300,000 movies and genre profiles for each movie
* store and update personalized recommendations for millions of users
* calculate most popular movies by genre at regular intervals
* serve requested movies to clients via a RESTful API
* connect with [other services](https://github.com/Tetraflix) via Amazon SQS to process data asynchronously throughout the system

## Contributing
Adhere to [airbnb style guide](https://github.com/airbnb/javascript).
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## System Data Flow
![system design](https://github.com/Tetraflix/recommendations/blob/development/images/data-flow.jpeg)

## Requirements
- Node 6.9.x
- Postgresql 9.6.x
- MongoDB 3.6.x
- Elasticsearch 5.6.3
- Kibana 5.6.3

## App Server Architecture
![service architecture](https://github.com/Tetraflix/AppServer/blob/master/serviceArchitecture.jpg?raw=true)

## Schema Design
![data base schema diagram](https://github.com/Tetraflix/AppServer/blob/master/dbSchema.png?raw=true)

## I/O
**Inputs:**
* Current recommendations for each user,
  * Update user recommendations (fast db for serving client)
```javascript
{
  userId: 534356757834,
  rec: [23, 105, 765, 32, 479]
} 
```
* Session data
  * Update view count for each movie when progress = 1 (movie db)
  * Periodically update genre recommendations based on view count (fast db for user recommendations)
```javascript
{
  userId: 534356757834,
  events: [
    {
      movie: {
        id: 543,
      },
      progress: 1,
      timestamp: 2017-09-08 12:50PM
    }, {
      movie: {
        id: 155,
      },
      progress: 0.7,
      timestamp: 2017-09-08 2:50PM
    }
  ]
}
```

**Outputs:**
* Current movie recommendations for a user and Serve up “continue watching” movies to client (change movie default progress from 0 to wherever they left off) (GET ‘/tetraflix/recommendations/:user’)
```javascript
{
  recommendations: [
    {
      id: 8675309,
      title:'Lord of the Rings',
      profile: {[genre breakdown]},
      progress: 0
    },
    {
      id: 4879823,
      title:'The Talented Mr.Ripley',
      profile: {[genre breakdown]},
      progress: 0
    }
  ],
  currentlyWatching: [
    {
      id: 234523,
      title:'Kahaani',
      profile: {[genre breakdown]},
      progress: 0.3
    },
    {
      id: 857636,
      title:'Memento',
      profile: {[genre breakdown]},
      progress: 0.7
    }
  ]
} 
```
* Serve up movies by genre, sorted in order of popularity (GET ‘/tetraflix/genre/:genre’)
```javascript
{
  genre: [
    {
      id: 34532,
      title: 'Amelie',
      profile: {[genre breakdown]},
      progress: 0
    },
    {
      id: 567490,
      title: 'Star Wars',
      profile: {[genre breakdown]},
      progress: 0
    }
  ]
}
```
