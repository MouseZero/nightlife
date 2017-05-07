const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')
const _ = require('lodash')

const going = (implementer, funcs) =>
  wrap(async ({body: { bar_id }, decoded: { id }}, res, next) => {
    res.json(await implementer(funcs, {bar_id, id}))
  })

const goingImplementer = async (add, { bar_id, id }) => {
  try {
    await add(bar_id, id)
    return {
      success: true,
      msg: 'user added to location'
    }
  } catch (err) {
    return {
      success: false,
      msg: 'could not add user to location'
    }
  }
}

const search = (implementer, funcs) =>
  wrap(async ({ query: { location } }, res, next) => {
    res.json(await implementer(funcs, {location}))
  })

const searchImplementer = async (searchBars, { location }) => {
  if (!location) throw new BadRequest('needs location')
  const result = await searchBars(location)
  return {
    success: true,
    result
  }
}

const mapGoing = async function (businessesArray, lookupFunction) {
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

module.exports = (status) => {
  const router = new Router()

  router
    .get('/', search(searchImplementer, bars.search, status.get))
    .post('/', going(goingImplementer, status.add))
  return router
}

Object.assign(module.exports, {
  search,
  addNumberGoing,
  searchImplementer,
  mergeData,
  goingImplementer,
  going,
  mapGoing
})
