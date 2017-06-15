const bcrypt = require('bcrypt')

module.exports = function usersFactory (db) {
  return { create, is, get, remove, isId, updatePassword }

  async function create (user) {
    const encryptedPassword = await bcrypt.hash(user.password, 9)
    await db.query(`
      insert into users
      (name, password)
      values ($1, $2)
    `, [user.name, encryptedPassword])
    return true
  }

  async function is (name) {
    return isFeild(name, 'name')
  }

  async function isId (id) {
    return isFeild(id, 'id')
  }

  async function isFeild (searchFor, columnName) {
    const { rows } = await db.query(`
      select *
      from users
      where "${columnName}" = $1
      `, [searchFor])
    return !!rows.length
  }

  async function get (name) {
    const { rows: [user] } = await db.query(`
      select *
        from users
       where name = $1
    `, [name])
    return user || null
  }

  async function updatePassword (idToEdit, newPassword) {
    const { rowCount } = await db.query(`
      UPDATE users
      SET password = $1
      WHERE id = $2
      `, [newPassword, idToEdit])
    return !!rowCount || null
  }

  async function remove (id) {
    const { rowCount } = await db.query(`
      delete from users
      where "id" = $1
    `, [id])
    return rowCount || null
  }
}
