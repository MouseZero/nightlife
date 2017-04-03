const { jwt, authenticate, mustHaveJWT } = require('./jwt-middleware')
const sinon = require('sinon')
const run = require('express-unit')
const jwtPromise = require('./util/jwtPromise')
const { expect } = require('chai')

describe('jwt-middleware', () => {
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
      it('happy path interactions work correctly', async () => {
        let tToken, tSecret
        const verify = (token, secret) => {
          tToken = token
          tSecret = secret
          return 'decoded'
        }
        const setup = (req, res, next) => {
          req.headers['x-access-token'] = 'mytoken'
          next()
        }
        const [ err, req ] = await run(setup, mustHaveJWT(verify, 'mySecret'))
        expect(err).to.equal(null)
        expect(tToken).to.equal('mytoken')
        expect(tSecret).to.equal('mySecret')
        expect(req.decoded).to.equal('decoded')
      })
      it('errors if verify false', async () => {
        const verify = () => Promise.reject(new Error())
        const setup = (req, res, next) => {
          req.headers['x-access-token'] = 'mytoken'
          next()
        }
        const [ err ] = await run(setup, mustHaveJWT(verify, 'mySecret'))
        expect(err).to.not.equal(null)
      })
    })
    it('errors if there is no JWT', async () => {
      await run(null, mustHaveJWT(), (err) => {
        expect(err).to.not.equal(null)
        expect(err).to.be.instanceof(Error)
      })
    })
  })
})
