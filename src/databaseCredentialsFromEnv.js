module.exports = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  connectionNumber: parseInt(process.env.DATABASE_CONNECTION_NUMBER),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT_MILLISECONDS)
}
