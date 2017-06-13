/*
TODO create another export that only takes a optional database
and doesn't take any more arguments. Have a built in pool that
passes down to the 2 other classes that need DB pools
*/
const pg = require('pg')
const config = require('./databaseCredentialsFromEnv')
const pool = new pg.Pool(config)
const Status = require('./persistence/status-factory')
const ResetTime = require('./persistence/reset-time')

async function dailyResetStatus (db = pool, timeOfDayUTC = 12) {
  const status = Status(db)
  const resetTime = ResetTime(db)
  const currentDate = new Date()
  await dailyResetStatusOrchestrater(
    currentDate,
    resetTime,
    status.delAll,
    timeOfDayUTC
  )
}

async function dailyResetStatusOrchestrater (
  currentDate,
  { get, set },
  resetAllStatus,
  timeOfDayUTC
) {
  if (currentDate.getTime() >= (await get()).getTime()) {
    try {
      await resetAllStatus()
      await set(nextDayAt(timeOfDayUTC, currentDate))
    } catch (error) {
      // TODO replace with real logging
      console.log(error)
    }
  }
}

function nextDayAt (timeOfDay, currentDate) {
  const newDate = new Date(currentDate)
  newDate.setDate(newDate.getDate() + 1)
  newDate.setHours(timeOfDay)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

module.exports = dailyResetStatus
Object.assign(module.exports, {
  Orchestrator: dailyResetStatusOrchestrater
})
