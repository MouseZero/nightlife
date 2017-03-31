const { jwt, authenticate, mustHaveJWT } = require('./jwt-middleware')
const sinon = require('sinon')
const run = require('express-unit')
const jwtPromise = require('./util/jwtPromise')
const { expect } = require('chai')

describe('jwt-middleware', () => {
  describe('jwt', () => {
    it('is a function', () => {
      expect(jwt).to.be.a('function')
    })
    it('returns function', () => {
      expect(jwt()).to.be.a('function')
    })
    context('successful request', () => {
      it('calls verify with correct arguments', async () => {
        let tToken, tSecret
        const stub = sinon.stub(jwtPromise, 'verify')
          .callsFake((token, secret) => {
            tToken = token
            tSecret = secret
            return Promise.resolve()
          })
        const setup = (req, res, next) => {
          req.headers['x-access-token'] = 'mytoken'
          next()
        }
        const middleware = jwt(stub, 'mysecret')
        const [err] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(tToken).to.equal('mytoken')
        expect(tSecret).to.equal('mysecret')
        jwtPromise.verify.restore()
      })
    })
    context('unsuccessful request', async () => {
      it('shoud error', async () => {
        const stub = sinon.stub(jwtPromise, 'verify')
          .callsFake(() => Promise.reject(new Error()))
        const setup = (req, res, next) => {
          res.json = json => { res.json = json }
          next()
        }
        const [err, , { json }] = await run(setup, jwt(stub, 'mysecret'))
        expect(err).to.equal(null)
        expect(json.success).to.equal(false)
        expect(!!json.message).to.equal(true)
        jwtPromise.verify.restore()
      })
    })
  })

  describe('authenticate', () => {
    context('user submits password and user', () => {
      let setup
      beforeEach(() => {
        setup = (req, res, next) => {
          req.body.user = 'bill'
          req.body.password = 'password'
          res.json = json => { res.json = json }
          next()
        }
      })
      it('should return success if password and user match', async () => {
        const getUser = () => { return {password: 'password'} }
        const middleware = authenticate(getUser, null, () => {})
        const [err, , { json }] = await run(setup, middleware)
        expect(err).to.equal(null)
        expect(json.success).to.equal(true)
      })
      it('errors if there is no user', async () => {
        const getUser = () => null
        const [err] = await run(setup, authenticate(getUser))
        expect(err).to.not.equal(null)
      })
      it('error if wrong password', async () => {
        const getUser = () => { return {password: 'otherPassword'} }
        const [err] = await run(setup, authenticate(getUser))
        expect(err).to.not.equal(null)
      })
    })
  })

  describe('mustHaveJWT', () => {
    it('is a function', () => {
      expect(mustHaveJWT).to.be.a('function')
    })
    it('returns a function', () => {
      expect(mustHaveJWT).to.be.a('function')
    })
    context('happy path', () => {
      it('calls verify correctly')
      it('returns req.decoded if successful')
      it('errors if verify false')
    })
    it('errors if there is no JWT', async () => {
      await run(null, mustHaveJWT(), (err) => {
        expect(err).to.not.equal(null)
        expect(err).to.be.instanceof(Error)
      })
    })
  })
})
