const { updateToken, yelpToToken } = require('./tokenFetcher')
const { expect } = require('chai')

describe('tokenFetcher', () => {
  describe('updateToken', async () => {
    it('is an async function', () => {
      expect(updateToken()).to.be.a('AsyncFunction')
    })
    it('If token is not expired return token', async () => {
      const tokenObj = {
        token: 'mytoken',
        expiresIn: 1000000,
        issuedAt: new Date()
      }
      const getNewToken = () => Promise.resolve({token: 'newToken'})
      const result = await updateToken(getNewToken)(tokenObj)
      expect(result).to.deep.equal(tokenObj)
    })
    it('If token is expired call getNewToken & return its object', async () => {
      const tokenObj = {
        token: 'mytoken',
        expiresIn: 1000,
        issuedAt: (new Date() - 1000000)
      }
      const getNewToken = () => Promise.resolve({
        access_token: 'newtoken',
        expires_in: 100000
      })
      const result = await updateToken(getNewToken)(tokenObj)
      expect(result.token).to.equal('newtoken')
      expect(result.expiresIn).to.equal(100000)
    })
  })

  describe('yelpToToken', () => {
    it('returns an async function', () => {
      expect(yelpToToken()).to.be.a('AsyncFunction')
    })
    it('reformats the object correctly', async () => {
      const getToken = () => Promise.resolve({
        access_token: 'mytoken',
        expires_in: 9
      })
      const {token, expiresIn, issuedAt} = await yelpToToken(getToken)()
      expect(token).to.equal('mytoken')
      expect(expiresIn).to.equal(9)
      expect(issuedAt - new Date()).to.be.within(-200, 200)
    })
    it('errors if format wrong', (done) => {
      const getToken = () => Promise.resolve({
        access_token: 'mytoken'
      })
      yelpToToken(getToken)()
        .then(() => done('should have errored'))
        .catch(() => done())
    })
  })
})
