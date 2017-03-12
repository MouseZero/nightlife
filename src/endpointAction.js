const { secret } = require('../config.json')
const jwt = require('jsonwebtoken')

function testEndpoint () {
  return {
    success: true,
    msg: 'The api is up and running'
  }
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

async function addUser (name, password, { createUser }) {
  return await actionConfirm([name, password], createUser)
}

async function removeUser (id, { deleteUser }) {
  return await actionConfirm([id], deleteUser)
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

async function searchLocation (keyword) {
  try {
    return Promise.resolve({
      success: true,
      msg: 'nothing really',
      keyword
    })
  } catch (err) {
    return Promise.resolve({
      success: true
    })
  }
}

module.exports = {
  testEndpoint,
  addUser,
  authenticate,
  removeUser,
  searchLocation
}
