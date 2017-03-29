const wrap = require('express-async-wrap')
const { verify } = require('./util/jwtPromise')
const { secret } = require('../config.json')

// Middleware that requires a token for the rest of the API end points
const jwt = (verify, secret) => wrap(async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  verify(token, secret)
  .then(decoded => {
    req.decoded = decoded
    next()
  })
  .catch(err => {
    res.json({success: false, message: err})
  })
})

const authenticate = (getUser, secret) => wrap(async (req, res, next) => {
  const user = getUser(req.body.user)
  if (!user) throw new Error('User does not exist')
  if (user.password !== req.body.password) throw new Error('Wrong password')
  res.json({success: true})
})

module.exports = () => {
  return {
    jwt: jwt(verify, secret)
  }
}
Object.assign(module.exports,
  {
    jwt,
    authenticate
  }
)
