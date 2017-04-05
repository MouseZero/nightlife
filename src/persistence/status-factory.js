module.exports = (db) => {
  return {create, get, update}

  async function create (locationId, userId) {
    await db.query(`
      INSERT INTO status
      values
      ($1, $2);
      `, [locationId, [userId]])
  }

  async function update (locationId, newUserId) {
    const old = await get(locationId)
    const newArray = [...old.users_going, newUserId]
    const result = await db.query(`
      UPDATE status
      SET users_going = $1
      WHERE id = $2
      `, [newArray, locationId])
    return result
  }

  async function get (id) {
    const { rows: [result] } = await db.query(`
      SELECT * FROM status WHERE id = $1
      `, [id])
    return result || null
  }
}
