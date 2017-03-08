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
      makeUser: users.createUser
    }
  )
}

function createUserInject (name, password, { makeUser }) {
  return new Promise(function (resolve, reject) {
    makeUser(name, password)
    .then(() => resolve({success: true}))
    .catch(err => resolve({
      success: false,
      error: err
    }))
  })
}

module.exports = {
  createJWT,
  testEndpoint,
  createUser,
  // Functions For Testing
  createUserInject
}
