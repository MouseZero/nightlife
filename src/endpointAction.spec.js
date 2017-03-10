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
    it('should retern success if makeUser is successful', function (done) {
      const makeUser = () => Promise.resolve(true)
      createUserInject(TESTUSER, TESTPASS, { makeUser })
      .then(result => {
        if (result.success) {
          done()
        } else {
          done('should have been a success')
        }
      })
    })

    it('should return err if makeUser errors', function (done) {
      const makeUser = () => {
        return Promise.reject(new Error('Was not able to create user'))
      }

      createUserInject(TESTUSER, TESTPASS, { makeUser })
      .then(function (result) {
        if (isNotSuccess(result)) {
          done()
        } else {
          done('could not find {success: false}')
        }
      })
      .catch(() => done('Should not have throwen an error'))
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
