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

const search = (implementer, funcs, formaterFuncs) =>
  wrap(async (req, res, next) => {
    const location = req.query.location
    const userId = req.decoded.id
    res.json(await implementer(funcs, {location, userId}, formaterFuncs))
  })

const searchImplementer =
async (searchBars, { location, userId }, formaterFuncs = (x) => x) => {
  if (!location) throw new BadRequest('needs location')
  let result = await searchBars(location)
  for (let i = 0; i < formaterFuncs.length; i++) {
    result = await formaterFuncs[i](result)
  }
  return {
    success: true,
    result
  }
}

const mapBusinesses = (key, calculateAnswer) =>
async (dataWithBusiness) => {
  const newBusinessesArray =
  await Promise.all(dataWithBusiness.businesses.map(async e => {
    const answer = await calculateAnswer(e.id)
    return Object.assign({},
    e,
    {[key]: answer}
    )
  }))
  const newResult = Object.assign({},
    dataWithBusiness,
    { businesses: newBusinessesArray })
  return newResult
}

const mapGoing = (calculateAnswerFunc) =>
  mapBusinesses('users_going', calculateAnswerFunc)

const numberOfUsersGoing = (get) =>
async (id) => {
  const got = await get(id)
  return (got && got['users_going']) ? got['users_going'].length : 0
}

module.exports = (status) => {
  const router = new Router()
  const formatBusinessesForUsersGoing = mapGoing(numberOfUsersGoing(status.get))

  router
    .get('/', search(searchImplementer, bars.search, [formatBusinessesForUsersGoing]))
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
