// How would you go about figuring out if the status data needs a reset

// What we have
// [lastUpdate, timeOfDayToRestart, currentDate]

async function dailyResetStatus (
  currentDate,
  { getResetTime, setResetTime },
  resetAllStatus,
  timeOfDay
) {
  if (currentDate.getTime() >= getResetTime().getTime()) {
    await resetAllStatus()
    await setResetTime(nextDayAt(timeOfDay, currentDate))
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
