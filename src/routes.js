const router = require('express').Router()

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json({
      success: true,
      msg: 'The api is up and running'
    })
  })

  router.post('/authenticate', function (req, res) {
    res.json({
      success: true,
      msg: 'it worked'
    })
  })

  return router
}
