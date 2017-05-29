const pg = require('pg')
const config = require('../../src/databaseCredentialsFromEnv')
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
const deleteTestStats = () => {
  return db.query(`
    DELETE FROM status WHERE id = 'bar1' or id = 'bar2';
  `)
  .then(x => console.log('deleted bar1'))
}
const createTestStats = () => {
  return db.query(`
  INSERT INTO
  status
  (id, users_going)
  VALUES
  ('bar1', '{5, 6, 9}');
  INSERT INTO
  status
  (id, users_going)
  VALUES
  ('bar2', '{2, 6, 12}');
  `)
  .then(x => console.log('created bar2'))
}

Promise.all([
  deleteTestUser(),
  createTestUser(),
  deleteTestStats(),
  createTestStats()])
  .then(() => {
    console.log('All test data has been written')
    process.exit()
  })

