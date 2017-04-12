const { add } = require('./status-routes')
const { expect } = require('chai')
const sinon = require('sinon')

describe('bar-routes', () => {
  describe('add', () => {
    it(`should call create if bar doesn't exists`, async () => {
      let calledLocation, calledUser
      const dbCreate = (x, y) => {
        calledLocation = x
        calledUser = y
      } 
      const dbUpdate = sinon.spy()
      const dbGet = () => null
      await add(dbCreate, dbGet, dbUpdate)('bar', 5)
      expect(dbUpdate.called).to.equal(false)
      expect(calledLocation).to.equal('bar')
      expect(calledUser).to.equal(5)
    })
    it(`should call "add" if there is already a bar`, async () => {
      let calledLocation, calledUser
      const dbUpdate = (x, y) => {
        calledLocation = x
        calledUser = y
      }
      const dbCreate = sinon.spy()
      const dbGet = () => 'returns something'
      await add(dbCreate, dbGet, dbUpdate)('bar', 5)
      expect(dbCreate.called).to.equal(false)
      expect(calledLocation).to.equal('bar')
      expect(calledUser).to.equal(5)
    })
  })
})