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