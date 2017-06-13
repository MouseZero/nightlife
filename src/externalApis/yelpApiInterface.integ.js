require('dotenv/config')
const { getToken, searchBars } = require('./yelpApiInterface')()
const { expect } = require('chai')
let realToken

describe('yelpApiInterface', () => {
  describe('getToken', () => {
    it('Returns the right keys', async () => {
      const result = await getToken()
      realToken = result.access_token
      expect(result).to.include.keys('expires_in', 'access_token', 'token_type')
      expect(result['token_type']).to.equal('Bearer')
    })
  })

  describe('searchBars', () => {
    it('Returns information about bars', async function () {
      this.timeout('10000')
      const result = await searchBars('irvine', realToken)
      expect(!!result.businesses).to.equal(true)
    })
  })
})
