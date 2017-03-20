const { Router } = require('express')
const wrap = require('express-async-wrap')

const findOne = users => wrap(async ({ params: { username } }, res) => {
  const user = await users.get(username)
  res.json(user)
})

const exists = users => wrap(async ({ params: { username } }, res, next) => {
  const exists = await users.is(username)
  if (exists) return res.sendStatus(400)
  next()
})

const create = users => wrap(async ({ body }, res) => {
  const created = await users.create(body)
  res.sendStatus(201)
})

module.exports = function usersRoutes(users) {

  const router = new Router()

  router
    .get('/:username', findOne(users))
    .post('/', exists(users), create(users))

  return router
}

Object.assign(module.exports, {
  findOne,
  exists,
  create
})
