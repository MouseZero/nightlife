const { userGoing } = require('./status-factory')
const { expect } = require('chai')

describe('status-factory', () => {
  describe('addUser', () => {
    it('should be an async function', () => {
      expect(userGoing).to.be.a('AsyncFunction')
    })
  })
})
