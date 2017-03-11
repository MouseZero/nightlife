const router = require('express').Router()
const endPointAction = require('./endpointAction')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endPointAction.testEndPoint())
  })

  router.post('/authenticate', async function (req, res) {
    const name = req.body.name
    const password = req.body.password
    res.json(await endPointAction.authenticate(name, password))
  })

  return router
}
