require('dotenv/config')
const pg = require('pg')
const config = require('../../src/databaseCredentialsFromEnv')
const db = new pg.Pool(config)

const createUserTable = () => {
  return db.query(`
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
  })
}

const createStatusTable = () => {
  return db.query(`
    CREATE TABLE public.status
    (
      id text NOT NULL,
      "users_going" integer[],
      CONSTRAINT status_pkey PRIMARY KEY (id)
    )
    WITH (
      OIDS=FALSE
    );
    ALTER TABLE public.status
      OWNER TO ${config.user};
    `)
  .then(() => { console.log('Created status table') })
}

const createResetClockTable = () => {
  return db.query(`
    CREATE TABLE public."reset-time"
    (
      "name-id" character varying(100) NOT NULL,
      "next-reset-time" timestamp with time zone,
      CONSTRAINT "id-key" PRIMARY KEY ("name-id")
    )
    WITH (
      OIDS=FALSE
    );
    ALTER TABLE public."reset-time"
      OWNER TO ${config.user};
    `)
  .then(() => { console.log('Created status table') })
}

Promise.all([createUserTable(), createStatusTable(), createResetClockTable()])
  .then(() => {
    console.log('All tables are created')
    process.exit()
  })
  .catch(x => console.log(x))
