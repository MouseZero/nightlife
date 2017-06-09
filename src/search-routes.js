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

const search = (implementer, search, getStatus) =>
  wrap(async (req, res, next) => {
    const location = req.query.location
    const userId = (req.decoded && req.decoded.id) ? req.decoded.id : ''
    if (!location) throw new BadRequest('needs "location" in query')
    if (!userId) throw new BadRequest('Needs a user ID, might need to login.')
    res.json(await implementer(search, {location, userId}, getStatus))
  })

const searchImplementer = async (
  searchBars,
  { location, userId },
  getStatus
) => {
  let businessData = await searchBars(location)
  const businesses = businessData.businesses
  const status = await Promise.all(
    businesses.map(async ({id}) => await getStatus(id))
  )
  const businessesWithNewFields = businesses.map((x, i) => {
    let userList = []
    if (status[i] && status[i]['users_going']) {
      userList = status[i]['users_going']
    }
    return addGoing(userList, addYourGoing(userList, userId, x))
  })

  return {
    success: true,
    result: Object.assign({},
      businessData,
      {
        businesses: businessesWithNewFields
      }
    )
  }
}

function addGoing (userStatus, original) {
  return Object.assign({},
    original,
    {
      users_going: userStatus.length
    }
  )
}

function addYourGoing (userStatus, userId, original) {
  return Object.assign({},
    original,
    {
      your_going: (userStatus.indexOf(userId) >= 0)
    }
  )
}

module.exports = (status) => {
  const router = new Router()

  router
    .get('/', search(searchImplementer, bars.search, status.get))
    .post('/', going(goingImplementer, status.add))
  return router
}

Object.assign(module.exports, {
  search,
  searchImplementer,
  goingImplementer,
  going
})
