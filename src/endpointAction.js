const pg = require('pg')
const { database: config } = require('../config.json')
const pool = new pg.Pool(config)
const users = require('./persistence/usersFactory')(pool)

function createJWT (name, password) {
  return {
    success: true,
    msg: 'test'
  }
}

function testEndpoint () {
  return {
    success: true,
    msg: 'The api is up and running'
  }
}

function createUser (name, password) {
  return createUser(
    name,
    password,
    {
      isUser: users.isUser,
      makeUser: users.createUser
    }
  )
}

function createUserInject (name, password, {isUser, makeUser}) {
  return isUser(name)
    .then(foundUser => {
      if (!foundUser) return makeUser(name, password)
      return Promise.resolve(false)
    })
}

module.exports = {
  createJWT,
  testEndpoint,
  createUser,
  // Functions For Testing
  createUserInject
}
