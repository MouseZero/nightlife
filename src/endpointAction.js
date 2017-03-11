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

function deleteUserInterface (name) {
  const { deleteUser } = users
  return deleteUserInject(name, deleteUser)
}

function createUser (name, password) {
  return createUser(name, password, users.createUser)
}

async function createUserInject (name, password, makeUser) {
  return await actionInject([name, password], makeUser)
}

async function deleteUserInject (name, deleteUser) {
  return await actionInject([name], deleteUser)
}

async function actionInject (argArray, fn) {
  try {
    await fn(...argArray)
    return Promise.resolve({success: true})
  } catch (err) {
    return Promise.resolve({
      success: false,
      msg: err
    })
  }
}

module.exports = {
  createJWT,
  testEndpoint,
  createUser,
  deleteUserInterface,
  // Functions For Testing
  createUserInject,
  deleteUserInject
}
