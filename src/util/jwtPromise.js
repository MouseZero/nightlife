const jwt = require('jsonwebtoken')

module.exports = {
  verify (token, secret) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, secret, function (err, decoded) {
        err && reject(err)
        resolve(decoded)
      })
    })
  }
}
