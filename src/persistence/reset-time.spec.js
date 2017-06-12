const ResetTime = require('./reset-time')
const { expect } = require('chai')
const { Pool } = require('pg')
const config = require('../databaseCredentialsFromEnv')

describe('reset-time', () => {
  const db = new Pool(config)
  let resetTime

  beforeEach(() => {
    resetTime = ResetTime(db)
    return db.query('begin')
  })

  afterEach(() => db.query('rollback'))

  after(() => db.end)

  describe('set', () => {
    it('should be an async function', () => {
      expect(resetTime.set).to.be.a('AsyncFunction')
    })
    it('updates existing time', async () => {
      await db.query(`
        DELETE FROM "reset-time"
        WHERE "name-id" = 'reset-time';
      `)
      const oldDate = new Date(2016, 0, 1)
      await db.query(`
        INSERT INTO "reset-time"
        VALUES
        ('reset-time', $1)
      `, [oldDate])
      const testDate = new Date()

      await resetTime.set(testDate)

      const { rows } = await db.query(`
        SELECT * FROM "reset-time" 
        WHERE "name-id" = 'reset-time';
      `)
      const result = rows[0]['next-reset-time']
      const newDate = new Date(result)
      expect(testDate.toISOString()).to.equal(newDate.toISOString())
    })
    it('creates new time', async () => {
      await db.query(`
        DELETE FROM "reset-time"
        WHERE "name-id" = 'reset-time';
      `)
      const testDate = new Date()

      await resetTime.set(testDate)

      const { rows } = await db.query(`
        SELECT * FROM "reset-time" 
        WHERE "name-id" = 'reset-time';
      `)
      const result = rows[0]['next-reset-time']
      const newDate = new Date(result)
      expect(testDate.toISOString()).to.equal(newDate.toISOString())
    })
  })
})
