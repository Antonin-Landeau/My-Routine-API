import mysql from 'mysql2'

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "challenge_app",
  multipleStatements: true,
})

export default db;