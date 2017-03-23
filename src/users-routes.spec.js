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

    it('finds a user by name', async () => {
      const user = { name: 'foo' }
      const setup = (req, res, next) => {
        req.params.name = 'foo'
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

  describe(`update`, () => {
    let middleware
    beforeEach(() => { middleware = usersRoutes.update(users) })

    it(`calls to update user`, async () => {
      const setup = (req, res, next) => {
        req.body.id = 1
        req.body.newPassword = 'newPassword'
        res.json = (json) => { res.json = json }
        stub(users, 'updatePassword').returns(Promise.resolve(true))
        res.sendStatus = stub()
        next()
      }
      const [ err, , {json} ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(json.success).to.equal(true)
      expect(users.updatePassword).to.have.been.calledWith(1, 'newPassword')
    })

    it(`errors if there is not an existing user`, async () => {
      const setup = (req, res, next) => {
        stub(users, 'updatePassword').returns(Promise.resolve(null))
        spy(res, 'sendStatus')
        next()
      }
      const [ err, , {sendStatus} ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(sendStatus).to.have.been.calledWith(400)
    })
  })

  describe('notUserNameExist', () => {
    let middleware
    beforeEach(() => { middleware = usersRoutes.notUserWithName(users) })

    context('when the user is found', () => {
      it('sends a 400', async () => {
        const setup = (req, res, next) => {
          req.body.name = 'foo'
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
          req.body.name = 'foo'
          stub(users, 'is').returns(Promise.resolve(false))
          next()
        }
        const [ err ] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(users.is).to.have.been.calledWith('foo')
      })
    })
  })

  describe(`test`, () => {
    let middleware

    beforeEach(() => {
      middleware = usersRoutes.test(users)
    })

    it(`success if you hit the test api page`, async () => {
      const setup = (req, res, next) => {
        res.json = json => { res.json = json }
        next()
      }
      const [ err, , { json: { success } } ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(success).to.equal(true)
    })
  })

  describe('notExist', () => {
    let middleware

    beforeEach(() => {
      middleware = usersRoutes.userWithId(users)
    })

    context('when the user is found', () => {
      it(`advanced to the next middleware`, async () => {
        const setup = (req, res, next) => {
          req.body.id = 5
          res.sendStatus = stub()
          stub(users, 'isId').returns(Promise.resolve(true))
          next()
        }
        const [ err, , res ] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(res.sendStatus.called).to.equal(false)
        expect(users.isId).to.have.been.calledWith(5)
      })
    })

    context('when the user is not found', () => {
      it(`sends a 400`, async () => {
        const setup = (req, res, next) => {
          req.body.id = 5
          spy(res, 'sendStatus')
          stub(users, 'isId').returns(Promise.resolve(false))
          next()
        }
        const [ err, , res ] = await run(setup, middleware)
        expect(users.isId).to.have.been.calledWith(5)
        expect(err).to.equal(null)
        expect(res.sendStatus).to.have.been.calledWith(400)
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
        req.body.id = 5
        stub(users, 'remove').returns(Promise.resolve(1))
        res.json = json => { res.json = json }
        next()
      }
      const [ err, , res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(res.json.success).to.equal(true)
      expect(!!res.json.msg).to.equal(true)
    })

    it('remove user that isn\'t there error', async () => {
      const setup = (req, res, next) => {
        req.body.id = 5
        stub(users, 'remove').returns(Promise.resolve(null))
        spy(res, 'sendStatus')
        next()
      }
      const [ err, , res ] = await run(setup, middleware)
      expect(err).to.equal(null)
      expect(res.sendStatus).to.have.been.calledWith(400)
      expect(users.remove).to.have.been.calledWith(5)
    })
  })
})
