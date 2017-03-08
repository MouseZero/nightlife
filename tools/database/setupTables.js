const { database: config } = require('../../config.json')
const pg = require('pg')
const pool = new pg.Pool(config)
const query = require('../../src/persistence/query')(pool)

query(`
  CREATE TABLE public.users
  (
    id SERIAL,
    name character(25),
    password character(300),
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT name UNIQUE (name)
  )
  WITH (
    OIDS=FALSE
  );
  ALTER TABLE public.users
    OWNER TO dev;
`)
.then(function (x) {
  console.log('Created users table')
  process.exit()
})
.catch(function (err) {
  console.log(err)
})
