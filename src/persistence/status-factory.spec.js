const statusFactory = require('./status-factory')
const { expect } = require('chai')
const { Pool } = require('pg')
const { database: config } = require('../../config.json')

describe('status-factory', () => {
  const db = new Pool(config)
  let status

  beforeEach(() => {
    status = statusFactory(db)
    return db.query('begin')
  })

  afterEach(() => db.query('rollback'))

  after(() => db.end)

  describe('create', () => {
    it('should be an async function', () => {
      expect(status.create).to.be.a('AsyncFunction')
    })
    it('can create', async () => {
      await status.create(7, 'bar-id')
      const { rows: [result] } = await db.query(`
        SELECT * FROM status WHERE id = $1;
        `, ['bar-id'])
      expect(result.id).to.equal('bar-id')
      expect(result['users_going']).to.deep.equal([7])
    })
  })

  describe('get', () => {
    it('no item exists', async () => {
      const result = await status.get('bar-id')
      expect(result).to.equal(null)
    })
    it('gets existing items', async () => {
      await db.query(`INSERT INTO status values ('bar-id', ARRAY[20, 9])`)
      const {id, users_going} = await status.get('bar-id')
      expect(id).to.equal('bar-id')
      expect(users_going).eql([20, 9])
    })
  })
})
