// Module name: database
// Language: javascript
// Path: src\modules\database.js

const pg = require('pg')
// --- Database connection ---
     // PostgreSQ connection
     const client = new pg.Client({
        user : process.env.DB_USER,
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        password : process.env.DB_PASS,
        port : process.env.DB_PORT,
        // String on one line to avoid errors
        string: process.env.DATABASE_URL // UNDEFINED !!
    })
// --- End of database connection ---

module.exports = { 
    client : client
 }