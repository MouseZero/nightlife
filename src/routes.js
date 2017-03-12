const router = require('express').Router()
const endPointAction = require('./endpointAction')
const pg = require('pg')
const { database: config, secret } = require('../config.json')
const pool = new pg.Pool(config)
const usersDb = require('./persistence/usersFactory')(pool)
const jwtPromise = require('./util/jwtPromise')

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json(endPointAction.testEndPoint())
  })

  router.post('/authenticate', async function (req, res) {
    const name = req.body.name
    const password = req.body.password
    res.json(await endPointAction.authenticate([name, password], usersDb))
  })

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

  router.get('/hide', function (req, res) {
    res.json({
      success: false,
      msg: 'you got here'
    })
  })

  return router
}
