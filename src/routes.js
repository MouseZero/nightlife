const router = require('express').Router()
const endPointAction = require('./endPointAction')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endPointAction.testEndPoint())
  })

  router.get('/authenticate', function (req, res) {
    res.json(endPointAction.createJWT())
  })

  return router
}
