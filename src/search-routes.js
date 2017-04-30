const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')
const _ = require('lodash')
const status = require('./persistence/status-factory.js')

const going = (status) =>
  wrap(async ({body: { bar_id, user_id }}, res, next) => {
    res.json({
      success: true,
      bar_id,
      user_id
    })
  })

const search = (searchBars, requestBarData) =>
  wrap(async ({ query: { location } }, res, next) => {
    res.json(await requestBarData(searchBars, location))
  })

const requestBarData = async (searchBars, location) => {
  if (!location) throw new BadRequest('needs location')
  const result = await searchBars(location)
  return {
    success: true,
    result
  }
}

const mergeData = _.curry((objArray, dataLabel, dataArray) => {
  return objArray.map((x, i) => {
    return Object.assign({}, x, {
      [dataLabel]: dataArray[i]
    })
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
    .post('/going', going(status))
  return router
}

Object.assign(module.exports, {
  search,
  addNumberGoing,
  requestBarData,
  mergeData
})
