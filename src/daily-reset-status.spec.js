const dailyResetStatus = require('./daily-reset-status').Orchestrator
const assert = require('assert')
const sinon = require('sinon')

describe('reset-intervals', () => {
  it('calls back if date over reset time', async () => {
    const currentDate = new Date(2017, 11, 31, 3, 11, 0)
    const get = sinon.stub()
    const set = sinon.spy()
    const resetAll = sinon.spy()
    const timeOfDay = 2
    get.returns(new Date(2017, 11, 31, 2, 57, 0))

    await dailyResetStatus(
      currentDate,
      {get, set},
      resetAll,
      timeOfDay
    )

    assert(resetAll.called, 'should have called reset')
    assert(set.called, 'setResetTime should have been called')
    assert(set.args[0][0], 'call setResetTime with argument')
    assert.equal(
      set.args[0][0].toString(),
      new Date(2018, 0, 1, 2).toString(),
      'should have called setResetTime with the current time'
    )
  })
  it('no callback if current date under reset time', async () => {
    const currentDate = new Date(2017, 5, 11, 3, 11, 0)
    const get = sinon.stub()
    const set = sinon.spy()
    const resetAll = sinon.spy()
    const timeOfDay = 2
    get.returns(new Date(2017, 5, 11, 4, 57, 0))

    await dailyResetStatus(
      currentDate,
      {get, set},
      resetAll,
      timeOfDay
    )

    assert(!resetAll.called, 'should not call resetAll')
    assert(!set.called, 'should not call setResetTime')
  })
})
