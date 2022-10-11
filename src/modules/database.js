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

    const connect = () => {
        client.connect()
        .then(() => {
            console.log(`Connected to the database \x1b[33m${process.env.DB_NAME}\x1b[0m with the user\x1b[33m ${process.env.DB_USER}\x1b[0m`)
            // If there is an error we log it
            client.on('error', err => {
                console.log(`Error while connecting to the database`,err)
            })
        })
    }
    const query = (text, params) => {
        return client.query(text, params)
    }
    const end = () => {
        client.end()
    }
// --- End of database connection ---

module.exports = { 
    client : client,
    connect : connect,
    query : query,
    end : end
 }