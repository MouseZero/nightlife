
module.exports = function usersFactory (db) {
  return { create, is, get, remove, isId }

  async function create (user) {
    await db.query(`
      insert into users
      (name, password)
      values ($1, $2)
    `, [user.name, user.password])
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

  async function remove (id) {
    const { rowCount } = await db.query(`
      delete from users
      where "id" = $1
    `, [id])
    return rowCount || null
  }
}
