const { Router } = require('express')
const wrap = require('express-async-wrap')
const { BadRequest, InternalServerError } = require('./custom-errors')
const _ = require('lodash')

const findOne = users => wrap(async ({ params: { username } }, res) => {
  const user = await users.get(username)
  const userInfo = _.omit(user, ['password'])
  res.json(userInfo)
})

const notUserWithName = users => wrap(async ({ body: { name } }, res, next) => {
  const exists = await users.is(name)
  if (exists) return next(new BadRequest('There is already a user with this name'))
  next()
})

const create = users => wrap(async ({ body }, res, next) => {
  if (!body.name || !body.password) {
    return next(new BadRequest(
      'needs name and password using x-www-form-urlencoded'
    ))
  }
  await users.create(body)
  res.status(201).json({
    success: true,
    message: 'Created User'
  })
})

const userWithId = users => wrap(async ({ body: {id} }, res, next) => {
  if (!id) return next(new BadRequest('needs id using x-www-form-urlencoded'))
  const exists = await users.isId(id)
  if (!exists) {
    return next(new BadRequest('There is no user with this name'))
  }
  next()
})

const remove = users => wrap(async (req, res, next) => {
  const id = req.decoded.id
  if (await users.remove(id)) {
    res.json({
      success: true,
      msg: `removed user with id: ${id}`
    })
  } else {
    next(new InternalServerError(
      `error trying to deleting user ${id}`
    ))
  }
})

const update = users => wrap(async ({ body: {id, password} }, res, next) => {
  if (await users.updatePassword(id, password)) {
    return res.json({
      success: true,
      message: `updated password for user ${id}`
    })
  }
  return next(new InternalServerError(
    `error trying to update password for user ${id}`
  ))
})

const test = users => wrap(async (req, res) => {
  res.json({
    success: true,
    msg: `You have hit the api. This endpoint doesn't do anything`
  })
})

module.exports = function usersRoutes (users) {
  const router = new Router()
  const { mustHaveJWT } = require('./jwt-middleware')(users)

  router
    .post('/', notUserWithName(users), create(users))
    .get('/', test(users))
    // require authentication
    .use(mustHaveJWT)
    .put('/', userWithId(users), update(users))
    .get('/:username', findOne(users))
    .delete('/', remove(users))

  return router
}

Object.assign(module.exports, {
  findOne,
  notUserWithName,
  create,
  remove,
  userWithId,
  test,
  update
})
