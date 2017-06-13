const { expect } = require('chai')
const pg = require('pg')
const config = require('./databaseCredentialsFromEnv')
const statusFactory = require('./persistence/status-factory')
const dailyResetStatus = require('./daily-reset-status')

describe('daily-reset-status', () => {
  const db = new pg.Pool(config)
  let status

  beforeEach(() => {
    return db.query('begin')
  })
  afterEach(() => db.query('rollback'))
  after(() => db.end)

  it.only('acts correctly if current time is over reset time', async () => {
    await db.query(`DELETE FROM status;`)
    await db.query(`DELETE FROM "reset-time";`)
    await db.query(`INSERT INTO status values ('bar1', ARRAY[2, 3])`)
    const resetDate = new Date()
    resetDate.setHours(resetDate.getHours() - 2)
    await db.query(
      `INSERT INTO "reset-time" VALUES ('reset-time', $1)`,
      [resetDate]
    )

    await dailyResetStatus(db)

    const {
      rows: [{
        'next-reset-time': nextResetTime
      }]
    } = await db.query(`SELECT * FROM "reset-time"`)
    expect(nextResetTime.toISOString()).to.not.equal(resetDate.toISOString())
    const statusResult = await db.query(`SELECT * FROM status`)
    expect(statusResult.rows.length).to.equal(0)
  })
  it('acts correctly if current time is under reset time')
})
