const checkEnvVar = (variable) => {
  if (!process.env[variable]) {
    console.log('Enviornment Varable ' + variable + ' is not set it is unlikly the program will work correctly')
  }
}

module.exports = () => {
  checkEnvVar('APP_SECRET')
  checkEnvVar('DATABASE_CONNECTION_NUMBER')
  checkEnvVar('DATABASE_DATABASE')
  checkEnvVar('DATABASE_HOST')
  checkEnvVar('DATABASE_IDLE_TIMEOUT_MILLISECONDS')
  checkEnvVar('DATABASE_PASSWORD')
  checkEnvVar('DATABASE_PORT')
  checkEnvVar('DATABASE_USER')
  checkEnvVar('YELP_APP_ID')
  checkEnvVar('YELP_APP_SECRET')
}
