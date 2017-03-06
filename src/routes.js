const router = require('express').Router()

module.exports = function routes () {
  router.get('/', function (req, res) {
    res.json({
      success: true,
      msg: 'it worked'
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
