const { Client } = require('pg');

const db = new Client({
  host: '127.0.0.1',
  user: 'postgres',  
  password: '2007',
  database: 'Finance_db',
  port: 5432, 
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL database."))
  .catch(err => console.error("Database connection error:", err.message));

module.exports = db;

