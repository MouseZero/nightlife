const USERTABLE = 'users'

module.exports = function (pool) {
  const query = require('./query')(pool)

  function createUser (name, password) {
    return new Promise(function (resolve, reject) {
      return query(`
          INSERT INTO ${USERTABLE}
          (name, password)
          VALUES
          ($1, $2)
        `, [name, password])
        .then(() => resolve(true))
        .catch(err => reject(err))
    })
  }

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
        .catch(err => reject(err))
    })
  }

  async function getUser (name) {
    try {
      const user = await query(`
        select * from users
        where name = $1
        `, [ name ])
      return Promise.resolve(user[0])
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }

  function deleteUser (id) {
    console.log('trying to delete user from db')
    return new Promise(function (resolve, reject) {
      return query(`
          DELETE FROM ${USERTABLE}
          WHERE "id" = $1
        `, [id])
        .then(() => resolve(true))
        .catch(err => reject(err))
    })
  }

  return {
    isUser,
    createUser,
    deleteUser,
    getUser
  }
}
