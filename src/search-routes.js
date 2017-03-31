const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')

const search = (searchBars) => wrap(async ({ body: { location } }, res, next) => {
  if (!location) next(new BadRequest('needs location'))
  const result = await searchBars(location)
  res.json({
    success: true,
    result
  })
})

module.exports = () => {
  const router = new Router()

  router
    .get('/', search(bars.search))
  return router
}

Object.assign(module.exports, {
  search
})
