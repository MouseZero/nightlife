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

const search = (implementer, funcs, formaterFunc) =>
  wrap(async ({ query: { location } }, res, next) => {
    res.json(await implementer(funcs, {location}, formaterFunc))
  })

const searchImplementer = 
async (searchBars, { location }, formaterFunc = (x) => x) => {
  if (!location) throw new BadRequest('needs location')
  const result = await formaterFunc(await searchBars(location))
  return {
    success: true,
    result
  }
}

const mapGoing = (lookupFunction) => 
async (dataWithBusiness) => {
  const newBusinessesArray = await Promise.all(dataWithBusiness.businesses.map(async e => {
    const answer = await lookupFunction(e.id)
    return Object.assign({},
    e,
    {users_going: answer}
    )
  }))
  const newResult = Object.assign({},
    dataWithBusiness,
    { businesses: newBusinessesArray })
  return newResult
}

const numberOfUsersGoing = (get) =>
async (id) => {
  const got = await get(id)
  return (got && got['users_going']) ? got['users_going'].length : 0
}

module.exports = (status) => {
  const router = new Router()
  const formatBusinessesForUsersGoing = mapGoing(numberOfUsersGoing(status.get))

  router
    .get('/', search(searchImplementer, bars.search, formatBusinessesForUsersGoing))
    .post('/', going(goingImplementer, status.add))
  return router
}

Object.assign(module.exports, {
  search,
  searchImplementer,
  goingImplementer,
  going,
  mapGoing
})
