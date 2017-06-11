const { Router } = require('express')
const bars = require('./externalApis/bars')()
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')
const _ = require('lodash')

const going = (implementer, params) =>
  wrap(async ({body: { bar_id }, decoded: { id }}, res, next) => {
    res.json(await implementer(Object.assign({}, params, {bar_id, id})))
  })

const isAlreadyGoing = async (get, barId, id) => {
  const goingObject = await get(barId)
  const going = (goingObject && goingObject['users_going'])
    ? goingObject['users_going']
    : []
  return (going.indexOf(id) !== -1)
}

const goingToggleImplementer = async ({ get, add, delUser, bar_id, id }) => {
  try {
    if (await isAlreadyGoing(get, bar_id, id)) {
      delUser(bar_id, id)
    } else {
      add(bar_id, id)
    }
    const newStatus = (isAlreadyGoing) ? 'Not Going' : 'Going'
    return {
      success: true,
      msg: 'Changed your status to ' + newStatus
    }
  } catch (err) {
    return {
      success: false,
      msg: 'unable to toggle going'
    }
  }
}

const search = (implementer, params, tokenToUserName) =>
wrap(async (req, res, next) => {
  params.location = req.query.location
  if (!params.location) throw new BadRequest('needs "location" in query')
  try {
    params.userId = await tokenToUserName(req.headers['x-access-token'])
  } catch (error) {
    console.log(error)
  }
  res.json(await implementer(params))
})

const searchImplementer = async (
  { searchBars, location, userId, getStatus }
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

module.exports = (status, userDb) => {
  const router = new Router()
  const { mustHaveJWT, tokenToUserName } = require('./jwt-middleware')(userDb)

  router
    .get('/', search(
      searchImplementer,
      {
        searchBars: bars.search,
        getStatus: status.get
      },
      tokenToUserName
    ))
    .use(mustHaveJWT)
    .post('/', going(goingToggleImplementer, {
      add: status.add,
      delUser: status.delUser,
      get: status.get
    }))
  return router
}

Object.assign(module.exports, {
  search,
  searchImplementer,
  goingToggleImplementer,
  going
})
