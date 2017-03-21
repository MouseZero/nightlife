const { Router } = require('express')
const wrap = require('express-async-wrap')

const findOne = users => wrap(async ({ params: { name } }, res) => {
  const user = await users.get(name)
  res.json(user)
})

const exists = users => wrap(async ({ body: { name } }, res, next) => {
  const exists = await users.is(name)
  if (exists) return res.sendStatus(400)
  next()
})

const create = users => wrap(async ({ body }, res) => {
  const created = await users.create(body)
  res.sendStatus(201)
})

const remove = users => wrap(async ({ params: { id } }, res) => {
  const deleteCount = await users.remove(id)
  if (await users.remove(id)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

module.exports = function usersRoutes(users) {

  const router = new Router()

  router
    .get('/:username', findOne(users))
    .post('/', exists(users), create(users))
    .delete('/', remove(users))

  return router
}

Object.assign(module.exports, {
  findOne,
  exists,
  create,
  remove
})
