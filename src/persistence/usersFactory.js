const USERTABLE = 'users'

module.exports = function (pool) {
  const query = require('./query')(pool)

  function isUser (name) {
    return new Promise(function (resolve, reject) {
      return query(`
          SELECT *
          FROM ${USERTABLE}
          WHERE "name" = $1;
        `, [name])
        .then(function (data) {
          if (data.length) return resolve(true)
          resolve(false)
        })
        .catch(function (err) {
          reject(err)
        })
    })
  }

  return {
    isUser
  }
}
