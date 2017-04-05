module.exports = (db) => {
  return {create, get}

  async function create (userId, locationId) {
    await db.query(`
      INSERT INTO status
      values
      ($1, $2);
      `, [locationId, [userId]])
  }

  async function get (id) {
    const { rows: [result] } = await db.query(`
      SELECT * FROM status WHERE id = $1
      `, [id])
    return result || null
  }
}
