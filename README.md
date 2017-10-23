# AppServer
Movie databases for Tetraflix

## Contributing
Adhere to [airbnb style guide](https://github.com/airbnb/javascript).
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#Requirements)
1. [Development](#Development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [About Tetraflix](#About)
1. [Tetraflix Services](#Services)
1. [Architecture Diagram](#Architecture)
1. [Database Schema](#Schema)

## Usage
* Some usage instructions

## Requirements
(list dependencies here e.g.)
- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc.

## Development
* add notes for installing dependencies and tasks here

## About
* Tetraflix is a minimal Netflix data-oriented clone.
* AppServer works with other services to answer the following business question: 
> Among users who don’t leave ratings, do recommendations based on modeled user genre preferences 
> outperform recommendations based on fixed genre preferences?  
* "Fixed genre preferences" refer to genre preferences set by a user upon signup. 
* Control Group: Recommendations are generated from initially fixed genre preferences.
* Experimental Group: Recommendations are generated from continually updated user genre preferences.
* KPI: total ratio of recommended movies watched to total movies watched per test group per day

## Services
### Events
Processes user click activity in the browser to construct a timeline of that user’s activity during a session.

### User Profiles
Interprets session data to constantly model and update user genre preferences for users in the experimental group.

### Recommendations
Feeds updated user genre preferences into an algorithm that matches the user with movies that have similar genre breakdowns

### App Server
Maintains a database of all Tetraflix movies and serves recommended and currently watching movies for a user and movies searched by genre to the client

## Architecture
* add architecture diagram / data flow here

## Schema
* add database schema here
