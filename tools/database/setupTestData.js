const pg = require('pg')
const { database: config } = require('../../config.json')
const db = new pg.Pool(config)

const deleteTestUser = () => {
  return db.query(`
    DELETE FROM users WHERE name = 'test';
  `)
}
const createTestUser = () => {
  return db.query(`
    INSERT INTO users
    (name, password)
    VALUES
    ('test', 'password');
  `)
  .then(x => console.log('Created Test User'))
  .catch(x => console.log(x))
}

Promise.all([deleteTestUser(), createTestUser()])
  .then(() => {
    console.log('All test data has been written')
    process.exit()
  })

