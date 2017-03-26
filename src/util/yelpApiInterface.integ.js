const { getToken } = require('./yelpApiInterface')()
const { expect } = require('chai')

describe('yelpApiInterface', () => {
  describe('getToken', () => {
    it('Should return the right keys', async () => {
      const result = await getToken()
      console.log(result)
      expect(result).to.include.keys('expires_in', 'access_token', 'token_type')
      expect(result['token_type']).to.equal('Bearer')
    })
  })
})
