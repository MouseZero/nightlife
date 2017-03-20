const { expect } = require('chai')
const usersFactory = require('./users-factory')
const { Pool } = require('pg')
const { database: config } = require('../../config.json')

describe('UserFactory', function () {
  const db = new Pool(config)
  let users

  beforeEach(() => {
    users = usersFactory(db)
    return db.query('begin')
  })

  afterEach(() => db.query('rollback'))

  describe('create', function () {
    it('create a user', async function () {
      const result = await users.create('name', 'password')
      expect(result).to.equal(true)
    })
  })

  describe('is', function () {
    it('should not exist if user isn\'t in the database', async () => {
      const result = await users.is('name')
      expect(result).to.equal(false)
    })

    it('should exist if there is a user', async () => {
      await db.query(`
        INSERT INTO users
        (name, password)
        values
        ('name', 'password');
        `)
      const result = await users.is('name')
      expect(result).to.equal(true)
    })
  })

  describe('get', function () {
    it('should return valid user object', async () => {
      await db.query(`
        INSERT INTO users
        (name, password)
        values
        ('name', 'password');
        `)
        const result = await users.get('name')
        expect(result).to.include({name: 'name', password: 'password'})
        expect(result).to.have.all.keys('id', 'name', 'password');
    })

    it('should be null if there is no user with name', async () => {
      const result = await users.get('name')
      expect(result).to.equal(null)
    })
  })

  describe('remove', function () {
    it('should remove the user', async () => {
      const { rows : [{ id }] } = await db.query(`
        INSERT INTO users
        (name, password)
        values
        ('name', 'password')
        RETURNING
        (id);
        `)
      expect(id).to.be.a('number')
      await users.remove(id)
      const { rows } = await db.query(`
        SELECT *
        FROM users
        WHERE id = '${id}';
        `)
      expect(rows.length).to.equal(0)
    })
  })

  after(() => {
    db.end()
  })
})
