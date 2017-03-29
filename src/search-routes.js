// const _ = require('lodash')
const { Router } = require('express')
const bars = require('./externalApis/bars')
const wrap = require('express-async-wrap')

const search = (searchBars) => wrap(async ({ body: { location } }, res) => {
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
}

Object.assign(module.exports, {
  search
})
