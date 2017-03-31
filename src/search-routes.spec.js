const { search } = require('./search-routes')
const { expect } = require('chai')
const run = require('express-unit')
const sinon = require('sinon')

describe('search-routes', () => {
  describe('search', () => {
    it('should be a function', () => {
      expect(search).to.be.a('function')
    })
    it('should return a function', () => {
      expect(search()).to.be.a('function')
    })
    it('passes location to searchBars', async () => {
      let passed
      const spy = sinon.spy(async function (x) {
        passed = x
      })
      const setup = (req, res, next) => {
        req.body.location = 'irvine'
        next()
      }
      await run(setup, search(spy))
      expect(passed).to.equal('irvine')
    })
    it('returns json result if success', async () => {
      const fakeResults = {
        test: {
          result: 1,
          result2: 5
        }
      }
      const spy = sinon.spy(() => Promise.resolve(fakeResults))
      const setup = (req, res, next) => {
        req.body.location = 'irvine'
        res.json = x => res.json = x
        next()
      }
      const [err, , {json}] = await run(setup, search(spy))
      expect(err).to.equal(null)
      expect(json.success).to.equal(true)
      expect(json.result).to.deep.equal(fakeResults)
    })
    it('errers out if request for search fails', async () => {
      const spy = sinon.spy(() => Promise.reject(new Error('error')))
      const setup = (req, res, next) => next()
      const [err] = await run(setup, search(spy))
      expect(!!err).to.equal(true)
    })
    it('erros if it gets bad inputs', async () => {
      await run(null, search(() => {}), (err) => {
        expect(err).to.not.equal(null)
        expect(err).to.be.instanceof(Error)
      })

    })
  })
})
