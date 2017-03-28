const { updateToken } = require('./tokenFetcher')
const { expect } = require('chai')

describe('tokenFetcher', () => {
  describe('updateToken', async () => {
    it('is an async function', () => {
      expect(updateToken()).to.be.a('AsyncFunction')
    })
    it('If token is not expired return token', async () => {
      const tokenObj = {
        token: 'mytoken',
        expiresIn: 10000000,
        issuedAt: new Date()
      }
      const getNewToken = async() => {
        return {token: 'newToken'}
      }
      const result = await updateToken(getNewToken)(tokenObj)
      expect(result).to.deep.equal(tokenObj)
    })
    it('If token is expired call getNewToken & return its object', async () => {
      const tokenObj = {
        token: 'mytoken',
        expiresIn: 1000,
        issuedAt: (new Date() - 1000000)
      }
      const getNewToken = async () => {
        return {token: 'newToken'}
      }
      const result = await updateToken(getNewToken)(tokenObj)
      expect(result).to.deep.equal(await getNewToken())
    })
  })
})
