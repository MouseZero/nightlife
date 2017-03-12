const router = require('express').Router()
const endpointAction = require('./endpointAction')
const pg = require('pg')
const { database: config, secret } = require('../config.json')
const pool = new pg.Pool(config)
const usersDb = require('./persistence/usersFactory')(pool)
const jwtPromise = require('./util/jwtPromise')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endpointAction.testEndPoint())
  })

  router.post('/user', async function (req, res) {
    const name = req.body.name
    const password = req.body.password
    res.json(await endpointAction.addUser(name, password, usersDb))
  })

  router.post('/authenticate', async function (req, res) {
    const name = req.body.name
    const password = req.body.password
    res.json(await endpointAction.authenticate([name, password], usersDb))
  })

  // Require JWT past this point
  router.use(function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token']
    jwtPromise.verify(token, secret)
    .then(function (decoded) {
      req.decoded = decoded
      next()
    })
    .catch(function (err) {
      res.json({success: false, message: err})
    })
  })

  router.delete('/user', async function (req, res) {
    const id = req.decoded.id
    res.json(await endpointAction.removeUser(id, usersDb))
  })

  router.get('/hide', function (req, res) {
    res.json({
      success: false,
      msg: 'you got here'
    })
  })

  router.get('/search/:location', async function (req, res) {
    res.json(await endpointAction.searchLocation(req.params.location))
  })

  return router
}
