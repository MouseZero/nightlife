const { expect } = require('chai')
const {describe, it} = require('mocha')
const {
  createUserInject,
  deleteUserInject
 } = require('./endpointAction')
const TESTUSER = 'bill'
const TESTPASS = 'password'

describe('Should be able to control user opperations', function () {
  describe('createUserInject', function () {
    it('should retern success if makeUser is successful', async function () {
      const makeUser = () => Promise.resolve(true)
      const result = await createUserInject(TESTUSER, TESTPASS, { makeUser })
      if (result.success) return Promise.resolve()
      return Promise.reject(new Error('should have been a success'))
    })

    it('should return err if makeUser errors', async function () {
      const makeUser = () => Promise.reject(new Error())
      const result = await createUserInject(TESTUSER, TESTPASS, { makeUser })
      if (isNotSuccess(result)) return Promise.resolve()
      return Promise.reject(new Error('Should have returned "success: false"'))
    })
  })

  describe('deleteUserInject', function () {
    it('should call deleteUser', async function () {
      const deleteUser = () => {
        deleteUser.called = true
        return Promise.resolve()
      }
      await deleteUserInject(TESTUSER, { deleteUser })
      expect(deleteUser.called).to.equal(true)
    })

    it('should return as success when it is a success', async function () {
      const deleteUser = () => Promise.resolve()
      const result = await deleteUserInject(TESTUSER, { deleteUser })
      expect(result.success).to.equal(true)
    })

    it('should git a false success for failed delete', async function () {
      const deleteUser = () => Promise.reject(new Error('some error'))
      const result = await deleteUserInject(TESTUSER, { deleteUser })
      expect(isNotSuccess(result)).to.equal(true)
    })
  })
})

function isNotSuccess (outputObject) {
  return typeof outputObject.success !== 'undefined' && !outputObject.success
}
