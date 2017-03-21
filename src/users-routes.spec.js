const usersRoutes = require('./users-routes')
const usersFactory = require('./persistence/users-factory')
const run = require('express-unit')
const { stub, spy } = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const { expect } = chai
chai.use(sinonChai)

describe('usersRoutes', () => {

  let users

  beforeEach(() => {
    users = usersFactory()
  })

  describe('findOne', () => {

    let middleware

    beforeEach(() => {
      middleware = usersRoutes.findOne(users)
    })

    it('finds a user by username', async () => {
      const user = { username: 'foo' }
      const setup = (req, res, next) => {
        req.params.username = 'foo'
        stub(users, 'get').returns(Promise.resolve(user))
        spy(res, 'json')
        next()
      }
      const [ err, , res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(users.get).to.have.been.calledWith('foo')
      expect(res.json).to.have.been.calledWith(user)
    })

  })

  describe('exists', () => {

    let middleware

    beforeEach(() => {
      middleware = usersRoutes.exists(users)
    })

    context('when the user is found', () => {
      it('sends a 400', async () => {
        const setup = (req, res, next) => {
          req.params.username = 'foo'
          stub(users, 'is').returns(Promise.resolve(true))
          spy(res, 'sendStatus')
          next()
        }
        const [ err, , res ] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(users.is).to.have.been.calledWith('foo')
        expect(res.sendStatus).to.have.been.calledWith(400)
      })
    })

    context('when the user is not found', () => {
      it('advanced to the next middleware', async () => {
        const setup = (req, res, next) => {
          req.params.username = 'foo'
          stub(users, 'is').returns(Promise.resolve(false))
          spy(res, 'sendStatus')
          next()
        }
        const [ err, , res ] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(users.is).to.have.been.calledWith('foo')
        expect(res.sendStatus).not.to.have.been.called
      })

    })

  })

  describe('create', () => {

    let middleware

    beforeEach(() => {
      middleware = usersRoutes.create(users)
    })

    it('creates a user', async () => {
      const user = { name: 'foo', password: 'bar' }
      const setup = (req, res, next) => {
        req.body = user
        stub(users, 'create')
        spy(res, 'sendStatus')
        next()
      }
      const [ err, , res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(users.create).to.have.been.calledWith(user)
      expect(res.sendStatus).to.have.been.calledWith(201)
    })
  })

  describe('remove', () => {
    let middleware

    beforeEach(() => {
      middleware = usersRoutes.remove(users)
    })

    it('removes a user', async () => {
      const setup = (req, res, next) => {
        req.params.id = 5
        stub(users, 'remove').returns(Promise.resolve(1))
        spy(res, 'sendStatus')
        next()
      }
      const [ err, ,res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(users.remove).to.have.been.calledWith(5)
      expect(res.sendStatus).to.have.been.calledWith(200)
    })

    it('remove user that isn\'t there error', async () => {
      const setup = (req, res, next) => {
        req.params.id = 5
        stub(users, 'remove').returns(Promise.resolve(null))
        spy(res, 'sendStatus')
        next()
      }
      const [err, ,res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(res.sendStatus).to.have.been.calledWith(400)
      expect(users.remove).to.have.been.calledWith(5)
    })

  })

})
