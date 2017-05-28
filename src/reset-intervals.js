const _ = require('lodash')

// Core
const millisecondsTillTimeOfDay = (hourOfDay, date) => {
  const offsetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hourOfDay
  )
  if (date.getUTCHours() > hourOfDay) {
    offsetDate.setDate(offsetDate.getDate() + 1)
  }
  return offsetDate - date
}

const setTimeoutTimeOfDay = _.curry((func, now, hourOfDay) => {
  setTimeout(func, millisecondsTillTimeOfDay(hourOfDay, now))
})

const startIntervalsAtTime = (func, now, hourOfDay, intervalTime) => {
  const startIntervalFunc = () => {
    func()
    setInterval(func, intervalTime)
  }
  setTimeoutTimeOfDay(startIntervalFunc, now, hourOfDay)
}

module.exports = (statusDB) => {
  const resetStatus = () => {
    statusDB.delUser()
    console.log('cleared data at', new Date())
  }
  const oneDay = 86400000
  const hourToResetAt = 4
  startIntervalsAtTime(
    resetStatus,
    new Date(),
    hourToResetAt,
    oneDay
  )
}

Object.assign(module.exports,
  {
    millisecondsTillTimeOfDay,
    setTimeoutTimeOfDay,
    startIntervalsAtTime
  }
)

/*
TODO
Plan
Set original reset based off of time of day
that will call a new 24 hour interval
*/