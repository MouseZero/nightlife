const dailyResetStatus = require('./daily-reset-status')
const assert = require('assert')
const sinon = require('sinon')

describe('reset-intervals', () => {
  it('calls back if date over reset time', async () => {
    const currentDate = new Date(2017, 11, 31, 3, 11, 0)
    const getResetTime = sinon.stub()
    const setResetTime = sinon.spy()
    const resetAll = sinon.spy()
    const timeOfDay = 2
    getResetTime.returns(new Date(2017, 11, 31, 2, 57, 0))

    await dailyResetStatus(
      currentDate,
      {getResetTime, setResetTime},
      resetAll,
      timeOfDay
    )

    assert(resetAll.called, 'should have called reset')
    assert(setResetTime.called, 'setResetTime should have been called')
    assert(setResetTime.args[0][0], 'call setResetTime with argument')
    assert.equal(
      setResetTime.args[0][0].toString(),
      new Date(2018, 0, 1, 2).toString(),
      'should have called setResetTime with the current time'
    )
  })
  it('no callback if current date under reset time', async () => {
    const currentDate = new Date(2017, 5, 11, 3, 11, 0)
    const getResetTime = sinon.stub()
    const setResetTime = sinon.spy()
    const resetAll = sinon.spy()
    const timeOfDay = 2
    getResetTime.returns(new Date(2017, 5, 11, 4, 57, 0))

    await dailyResetStatus(
      currentDate,
      {getResetTime, setResetTime},
      resetAll,
      timeOfDay
    )

    assert(!resetAll.called, 'should not call resetAll')
    assert(!setResetTime.called, 'should not call setResetTime')
  })
  it('should do something with errors')
})
