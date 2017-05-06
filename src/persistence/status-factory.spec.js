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
      await status.create('bar-id', 7)
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

  describe('getNumberOfUsers', () => {
    it('returns the number of users', async() => {
      await db.query(`INSERT INTO status values ('bar-id', ARRAY[20, 9, 53, 5618])`)
      const result = await status.getNumberOfUsers('bar-id')
      expect(result).to.equal(4)
    })
    it('returns 0 if there are no users', async () => {
      const result = await status.getNumberOfUsers('some-id-not-there')
      expect(result).to.equal(0)
    })
  })

  describe('add', () => {
    it('adds entry to empty db', async () => {
      await status.add('bar1', 5)
      const {rows: [result]} = await db.query(`SELECT * FROM status WHERE id = 'bar1'`)
      expect(result.id).to.equal('bar1')
      expect(result.users_going).to.include(5)
    })
    it('updates existing entry in db', async () => {
      await status.add('bar1', 5)
      await status.add('bar1', 7)
      await status.add('bar1', 298)
      const {rows: [result]} = await db.query(`SELECT * FROM status WHERE id = 'bar1'`)
      expect(result.id).to.equal('bar1')
      expect(result.users_going).to.include(5)
      expect(result.users_going).to.include(7)
      expect(result.users_going).to.include(298)
    })
    it('cannot add duplicate records', async () => {
      await status.add('bar1', 5)
      await status.add('bar1', 5)
      await status.add('bar1', 9)
      await status.add('bar1', 9)
      await status.add('bar1', 9)
      const {rows: [result]} = await db.query(`SELECT * FROM status WHERE id = 'bar1'`)
      expect(result.users_going.length).to.equal(2)
    })
  })

  describe('update', () => {
    it('updates existing entry', async () => {
      await db.query(`INSERT INTO status values ('bar1', ARRAY[2])`)
      await status.update('bar1', 8)
      const {rows: [result]} = await db.query(`SELECT * FROM status WHERE id = 'bar1'`)
      expect(result.users_going).to.deep.equal([2, 8])
    })
    it('throws error if user is already going to location', (done) => {
      db.query(`INSERT INTO status values ('bar1', ARRAY[2, 5])`)
        .then(() => {
          return status.update('bar1', 5)
        })
        .then(() => {
          done('should have thrown an error')
        })
        .catch(() => {
          done()
        })
    })
  })

  describe('delUser', () => {
    it('deletes a single user form the location', async () => {
      await db.query(`INSERT INTO status values ('some-id', ARRAY[2, 5, 9])`)
      await status.delUser('some-id', 5)
      const {rows: [result]} = await db.query(`SELECT * FROM status WHERE id = 'some-id'`)
      expect(result.id).to.equal('some-id')
      expect(result.users_going).to.deep.equal([2, 9])
    })
  })

  describe('delAll', () => {
    it('deletes all of the locations in the status table', async () => {
      await db.query(`INSERT INTO status values ('some-id', ARRAY[2, 5, 9])`)
      await db.query(`INSERT INTO status values ('some-id2', ARRAY[2, 5, 9])`)
      await db.query(`INSERT INTO status values ('some-id3', ARRAY[2, 5, 9])`)
      await status.delAll()
      const {rows: [{ count }]} = await db.query(`SELECT COUNT(*) FROM status`)
      expect(count).to.equal('0')
    })
  })
})
