module.exports = function routes (router) {
  router.get('/', function (req, res) {
    res.json({
      success: true,
      msg: 'it worked'
    })
  })
}
