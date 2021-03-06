const { expect } = require('chai')
const usersFactory = require('./users-factory')
const { Pool } = require('pg')
const config = require('../databaseCredentialsFromEnv')

describe('UserFactory', function () {
  const db = new Pool(config)
  let users

  beforeEach(() => {
    users = usersFactory(db)
    return db.query('begin')
  })

  afterEach(() => db.query('rollback'))

  after(() => db.end())

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

  describe('isId', () => {
    it('should not exist if user isn\'t in the database', async () => {
      const { rows: [{ max }] } = await db.query(`
        SELECT MAX(id)
        FROM users;
        `)
      const idThatDoesNotExist = max + 1
      const result = await users.isId(idThatDoesNotExist)
      expect(result).to.equal(false)
    })

    it('should exist if there is a user', async () => {
      const { rows: [{id}] } = await db.query(`
        INSERT INTO users
        (name, password)
        values
        ('name', 'password')
        RETURNING
        (id);
        `)
      const result = await users.isId(id)
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
      expect(result).to.have.all.keys('id', 'name', 'password')
    })

    it('should be null if there is no user with name', async () => {
      const result = await users.get('name')
      expect(result).to.equal(null)
    })
  })

  describe('remove', function () {
    it('should remove the user', async () => {
      const { rows: [{ id }] } = await db.query(`
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

    it('should return null if user doesn\'t exist', async () => {
      const { rows: [{ max }] } = await db.query(`
        SELECT MAX(id)
        FROM users;
        `)
      const idThatDoesNotExist = max + 1
      const result = await users.remove(idThatDoesNotExist)
      expect(result).to.equal(null)
    })
  })
})
