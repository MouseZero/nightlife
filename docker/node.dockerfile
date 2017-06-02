#Create Network: docker network create --driver bridge isolated_network
#Build: docker build -t mousezero/node .
#Setup Postgres: docker run --name some-postgres --net=isolated_network -p 5432:5432 -e POSTGRES_PASSWORD=vWhjvDQX6plS3uY -d postgres
#Setup Node: docker run -d -p 8080:3000 --name my-node --net=isolated_network mousezero/node

####REQUIRED ENV####
#NODE_ENV
#  - production
#  - development
FROM node:7.8.0

MAINTAINER Russell Murray

ARG type_env

COPY . /node
WORKDIR /node

RUN chmod g+x ./docker/scripts/${type_env}/install.sh
RUN ./docker/scripts/${type_env}/install.sh
RUN npm install

EXPOSE 3033

ENTRYPOINT ["npm", "start"]
