const router = require('express').Router()
const endpointAction = require('./endpointAction')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endpointAction.testEndpoint())
  })

  router.get('/authenticate', function (req, res) {
    res.json(endpointAction.createJWT())
  })

  return router
