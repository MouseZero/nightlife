const { Router } = require('express')
const wrap = require('express-async-wrap')
const { BadRequest } = require('./custom-errors')

const findOne = users => wrap(async ({ params: { name } }, res) => {
  const user = await users.get(name)
  res.json(user)
})

const notUserWithName = users => wrap(async ({ body: { name } }, res, next) => {
  const exists = await users.is(name)
  if (exists) return next(new BadRequest('There is already a user with this name'))
  next()
})

const create = users => wrap(async ({ body }, res, next) => {
  if (!body.name || !body.password) {
    next(new BadRequest(
      'You have to pass in a name and password using x-www-form-urlencoded'
    ))
  }
  await users.create(body)
  res.sendStatus(201)
})

const userWithId = users => wrap(async ({ body: {id} }, res, next) => {
  const exists = await users.isId(id)
  if (!exists) return res.sendStatus(400)
  next()
})

const remove = users => wrap(async ({ body: { id } }, res) => {
  if (await users.remove(id)) {
    res.json({
      success: true,
      msg: `removed user with id: ${id}`
    })
  } else {
    res.sendStatus(400)
  }
})

const update = users => wrap(async ({ body: {id, password} }, res) => {
  if (await users.updatePassword(id, password)) {
    return res.json({ success: true })
  }
  return res.sendStatus(400)
})

const test = users => wrap(async (req, res) => {
  res.json({
    success: true,
    msg: `You have hit the api. This endpoint doesn't do anything`
  })
})

module.exports = function usersRoutes (users) {
  const router = new Router()

  router
    .get('/', test(users))
    .get('/:username', findOne(users))
    .post('/', notUserWithName(users), create(users))
    .delete('/', userWithId(users), remove(users))
    .put('/', userWithId(users), update(users))

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
