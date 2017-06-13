const pg = require('pg')
const config = require('./databaseCredentialsFromEnv')
const pool = new pg.Pool(config)

describe('daily-reset-status', () => {
  it('acts correctly if current time is over reset time')
  it('acts correctly if current time is under reset time')
})