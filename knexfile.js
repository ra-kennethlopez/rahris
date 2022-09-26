require('dotenv').config()

const {
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE
} = process.env

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: DB_CLIENT,
    connection: {
      host : DB_HOST,
      port : DB_PORT,
      user : DB_USER,
      password : DB_PASSWORD,
      database : DB_DATABASE
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
