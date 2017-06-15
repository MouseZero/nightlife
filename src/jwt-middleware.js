const wrap = require('express-async-wrap')
const { verify } = require('./util/jwtPromise')
const { sign } = require('jsonwebtoken')
const secret = process.env.APP_SECRET
const { BadRequest } = require('./custom-errors')
const bcrypt = require('bcrypt')

const authenticate = (getUser, secret, sign) => wrap(async (req, res, next) => {
  if (!req.body.user || !req.body.password) {
    throw new BadRequest(`"user" and "password" are required. Please use x-www-form-urlencoded for data`)
  }
  const user = await getUser(req.body.user)
  if (!user) throw new BadRequest('User does not exist')
  console.log('req.body.password', req.body.password)
  console.log('user.password', user.password)
  console.log('compare', await bcrypt.compare(req.body.password, user.password))
  if (!await bcrypt.compare(req.body.password, user.password)) {
    throw new Error('Wrong password')
  }
  const token = sign({id: user.id}, secret, {
    expiresIn: 86400
  })
  res.json({
    success: true,
    token
  })
})

const tokenToUserName = async (token) => {
  if (!token) return ''
  const { id } = await verify(token, secret)
  return id
}

const mustHaveJWT = (verify, secret) => wrap(async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  if (!token) return next(new BadRequest('You need to have a token for access'))
  req.decoded = await verify(token, secret)
  return next()
})

module.exports = (users) => {
  return {
    mustHaveJWT: mustHaveJWT(verify, secret),
    authenticate: authenticate(users.get, secret, sign),
    tokenToUserName
  }
}
Object.assign(module.exports,
  {
    authenticate,
    mustHaveJWT,
    tokenToUserName
  }
)
