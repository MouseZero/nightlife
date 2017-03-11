const { expect } = require('chai')
const {describe, it} = require('mocha')
const {
  createUserInject,
  deleteUserInject,
  authenticateInject
 } = require('./endpointAction')
const TESTUSER = 'bill'
const TESTPASS = 'password'

describe('Should be able to control user opperations', function () {
  describe('createUserInject', function () {
    it('should retern success if makeUser is successful', async function () {
      const makeUser = () => Promise.resolve(true)
      const result = await createUserInject(TESTUSER, TESTPASS, makeUser)
      expect(result.success).to.equal(true)
    })

    it('should return err if makeUser errors', async function () {
      const makeUser = () => Promise.reject(new Error())
      const result = await createUserInject(TESTUSER, TESTPASS, makeUser)
      expect(result.success).to.equal(false)
    })
  })

  describe('deleteUserInject', function () {
    it('should return as success when it is a success', async function () {
      const deleteUser = () => Promise.resolve()
      const result = await deleteUserInject(TESTUSER, deleteUser)
      expect(result.success).to.equal(true)
    })

    it('should git a false success for failed delete', async function () {
      const deleteUser = () => Promise.reject(new Error('some error'))
      const result = await deleteUserInject(TESTUSER, deleteUser)
      expect(result.success).to.equal(false)
    })
  })

  describe('authenticateInject', function () {
    it('should return success if callback returns same password', async function () {
      const getUser = () => Promise.resolve({password: TESTPASS})
      const result = await authenticateInject(['', TESTPASS], getUser)
      expect(result.success).to.be.equal(true)
    })

    it('should return "success: false" if callback Errors', async function () {
      const getUser = () => Promise.reject(new Error())
      const result = await authenticateInject(['', ''], getUser)
      expect(result.success).to.be.equal(false)
    })
  })
})
