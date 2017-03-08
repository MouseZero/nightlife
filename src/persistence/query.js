const _ = require('lodash')

module.exports = _.curry(function (pool, queryString) {
  const params = arguments[2] || []
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        return reject(err)
      }

      client.query(queryString, params, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result.rows)
        done()
      })
    })
  })
})
