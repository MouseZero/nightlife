const { database: config } = require('../../config.json')
const pg = require('pg')
const pool = new pg.Pool(config)
const query = require('../../src/persistence/query')(pool)

query(`
  CREATE TABLE public.users
  (
    id SERIAL,
    name varchar(25),
    password varchar(300),
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT name UNIQUE (name)
  )
  WITH (
    OIDS=FALSE
  );
  ALTER TABLE public.users
    OWNER TO ${config.user};
`)
.then(function (x) {
  console.log('Created users table')
  process.exit()
})
.catch(function (err) {
  console.log(err)
})
