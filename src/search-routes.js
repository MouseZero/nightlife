const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')

const search = (searchBars) => wrap(async ({ query: { location } }, res, next) => {
  if (!location) next(new BadRequest('needs location'))
  const result = await searchBars(location)
  res.json({
    success: true,
    result
  })
})

const addNumberGoing = (lookup) => (businesses) => {
  return businesses.reduce((p, x) => {
    const newX = Object.assign({}, x, {numberGoing: lookup(x.id)})
    return [...p, newX]
  }, [])
}

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
