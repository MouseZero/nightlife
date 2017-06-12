module.exports = (db) => {
  return {set}

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
    `, [id, time.toISOString()])
    return result
  }
}
