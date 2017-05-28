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

const resetAtTime = (func, now, timeOfDay) => {
}

module.exports = (statusDB) => {
  console.log('called reset intervals')
  const now = new Date()
  millisTillReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0) - now;
}

Object.assign(module.exports,
  {
    millisecondsTillTimeOfDay
  }
)

/*
Plan
Set original reset based off of time of day
that will call a new 24 hour interval
*/