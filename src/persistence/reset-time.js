module.exports = (db) => {
  return {set, get}

  async function set (time, id = 'reset-time') {
    await db.query(`
    DELETE FROM "reset-time"
    WHERE "name-id" = $1
    `, [id])
    const result = await db.query(`
    INSERT INTO "reset-time"
    ("name-id", "next-reset-time")
    VALUES
    ($1, $2)
    `, [id, time])
    return result
  }

  function nextTimeValue (row) {
    return row[0]['next-reset-time']
  }

  async function get (id = 'reset-time') {
    const { rows } = await db.query(`
      SELECT * FROM "reset-time"
      WHERE "name-id" = $1;
    `, [id])
    return new Date(nextTimeValue(rows))
  }
}
