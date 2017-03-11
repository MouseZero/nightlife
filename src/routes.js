const router = require('express').Router()
const endPointAction = require('./endpointAction')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endPointAction.testEndPoint())
  })

  router.post('/test', function (req, res) {
    res.json({
      success: true,
      name: req.body.name,
      password: req.body.password
    })
  })

  router.get('/authenticate', function (req, res) {
    res.json(endPointAction.createJWT())
  })

  return router
}
