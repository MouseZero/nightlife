const pg = require('pg')
const { database: config, secret } = require('../config.json')
const pool = new pg.Pool(config)
const users = require('./persistence/usersFactory')(pool)
const jwt = require('jsonwebtoken')

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

async function authenticate ([name, password], { getUser }) {
  try {
    const user = await getUser(name, password)
    if (user.password.trim() === password) {
      const token = jwt.sign({id: user.id}, secret, {
        expiresIn: 86400
      })
      return Promise.resolve({
        success: true,
        token
      })
    }
    return Promise.resolve({
      success: false,
      msg: 'Password does not match'
    })
  } catch (err) {
    return Promise.resolve({
      success: false,
      msg: err
    })
  }
}

async function createUserInject (name, password, makeUser) {
  return await actionConfirm([name, password], makeUser)
}

async function deleteUserInject (name, deleteUser) {
  return await actionConfirm([name], deleteUser)
}

async function actionConfirm (argArray, fn) {
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
  authenticate,
  // Functions For Testing
  createUserInject,
  deleteUserInject
}
