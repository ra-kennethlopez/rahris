import * as dotenv from 'dotenv'
import DB from "./db";

dotenv.config()

const {
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE
} = process.env

export const connection = new DB({
  client: DB_CLIENT,
  connection: {
    host : DB_HOST,
    port : parseInt(DB_PORT ?? ""),
    user : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE
  }
});