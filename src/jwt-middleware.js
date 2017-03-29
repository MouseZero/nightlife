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

module.exports = () => {
  return {jwt: jwt(verify, secret)}
}

Object.assign(module.exports,
  {
    jwt
  }
)
