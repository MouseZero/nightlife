const { database:config } = require('../../config.json')
const pg = require('pg')
const pool = new pg.Pool(config)
const query = require('../../src/persistence/query')(pool)

query(`SELECT * FROM users`)
.then(function(x) {
  console.log(x);
})
.catch(function (err) {
  console.log(err)
})
