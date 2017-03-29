const { search } = require('./bars')
const { expect } = require('chai')
const sinon = require('sinon')

describe('bars', () => {
  describe('search', () => {
    it('is a function', () => {
      expect(search).to.be.a('function')
    })
    it('returns an async function', async () => {
      expect(await search()).to.be.a('AsyncFunction')
    })
    context('successful call', () => {
      it('calls the right functions with correct params', async () => {
        let tLocation
        let tToken
        const getToken = sinon.spy(async () => {
          return {token: 'mytoken'}
        })
        const searchBars = sinon.spy(async (location, token) => {
          tLocation = location
          tToken = token
          return 'test'
        })
        await search(getToken, searchBars)('orange')
        expect(getToken.called).to.equal(true)
        expect(searchBars.called).to.equal(true)
        expect(tLocation).to.equal('orange')
        expect(tToken).to.equal('mytoken')
      })
    })
  })
})
