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

module.exports = {
  createJWT,
  testEndpoint
}
