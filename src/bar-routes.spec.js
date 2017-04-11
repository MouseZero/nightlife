const { add } = require('./bar-routes')
const { expect } = require('chai')

describe('bar-routes', () => {
  describe('add', () => {
    it('should be a function', () => {
      expect(add).to.be.a('function')
    })
  })
})