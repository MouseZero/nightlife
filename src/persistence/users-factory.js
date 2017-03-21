
module.exports = function usersFactory (db) {
  return { create, is, get, remove }

  async function create (name, password) {
    await db.query(`
      insert into users
      (name, password)
      values ($1, $2)
    `, [name, password])
    return true
  }

  async function is (name) {
    const { rows } = await db.query(`
      select *
        from users
       where "name" = $1
    `, [name])
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
