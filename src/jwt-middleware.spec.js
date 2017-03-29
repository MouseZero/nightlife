const { jwt } = require('./jwt-middleware')
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
})
