const { add, get } = require('./status-routes')
const { expect } = require('chai')
const sinon = require('sinon')

describe('bar-routes', () => {
  describe('add', () => {
    it(`called create if bar doesn't exists`, async () => {
      let calledLocation, calledUser
      const create = (x, y) => {
        calledLocation = x
        calledUser = y
      }
      const update = sinon.spy()
      const get = () => null
      await add({create, get, update})('bar', 5)
      expect(update.called).to.equal(false)
      expect(calledLocation).to.equal('bar')
      expect(calledUser).to.equal(5)
    })
    it(`called "add" if there is already a bar`, async () => {
      let calledLocation, calledUser
      const update = (x, y) => {
        calledLocation = x
        calledUser = y
      }
      const create = sinon.spy()
      const get = () => 'returns something'
      await add({create, get, update})('bar', 5)
      expect(create.called).to.equal(false)
      expect(calledLocation).to.equal('bar')
      expect(calledUser).to.equal(5)
    })
  })

  describe('get', () => {
    it(`calls statusGet with the locationId`, async () => {
      const statusGet = sinon.spy()
      await get(statusGet)('5')
      expect(statusGet.called).to.equal(true)
    })
  })
})
