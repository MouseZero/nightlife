const { jwt } = require('./jwt-middleware')
const sinon = require('sinon')
const run = require('express-unit')
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
        let tToken, tSecret, spy
        spy = sinon.spy((token, secret) => {
          tToken = token
          tSecret = secret
        })
        const setup = (req, res, next) => {
          req.headers['x-access-token'] = 'mytoken'
          next()
        }
        const middleware = jwt(spy, 'mysecret')
        await run(setup, middleware)
        expect(tToken).to.equal('mytoken')
        expect(tSecret).to.equal('mysecret')
      })
    })
  })
})
