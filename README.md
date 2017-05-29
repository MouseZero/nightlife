# Nightlife Backend

## Setup Dev Environment

### Requirements
- Docker

### Setup Commands
Note if you are in Ubuntu you will have to `sudo su` first
This will create containers for the node and database
``` bash
export APP_ENV=development
docker-compose build
docker-compose up -d
```
you will need to create a .env file in the root directory and fill in varables to match your yelp account credentals

example:
```
YELP_APP_ID = 65165121lkjlkjlk-8d
YELP_APP_SECRET = lkmalikx51981elakmvklams56mlkamd56185151adskljfaslkdf
```
next we need to open the container
``` bash
docker ps
```
look for the node "CONTAINER ID" of the node container. It probably looks something like this `nightlifebackend_node`
``` bash
docker attach 27762584190d
```
This will put you in the node container as `root`
``` bash
npm run setupDocker
```

### Non Docker Setup
You will need to either create a `.env` file or you need to setup the following environment varables. You will have to change these variables to fit your requirements
```
APP_SECRET = replace-with-secret
DATABASE_CONNECTION_NUMBER = 3
DATABASE_DATABASE = app
DATABASE_HOST = postgres
DATABASE_IDLE_TIMEOUT_MILLISECONDS = 30000
DATABASE_PASSWORD = password
DATABASE_PORT = 5432
DATABASE_USER = app
YELP_APP_ID = testid
YELP_APP_SECRET = testsecret
```