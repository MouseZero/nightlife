const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')
const _ = require('lodash')
const status = require('./persistence/status-factory.js')

const search = (searchBars) => wrap(async ({ query: { location } }, res, next) => {
  if (!location) next(new BadRequest('needs location'))
  const result = await searchBars(location)
  res.json({
    success: true,
    result
  })
})

const addNumberGoing = _.curry((lookup, businesses) => {
  return businesses.reduce((p, x) => {
    const numberGoing = (lookup(x.id)) ? lookup(x.id) : 0
    const newX = Object.assign({}, x, {numberGoing})
    return [...p, newX]
  }, [])
})

module.exports = () => {
  const router = new Router()

  router
    .get('/', search(bars.search))
  return router
}

Object.assign(module.exports, {
  search,
  addNumberGoing
})
