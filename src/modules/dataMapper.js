const pg = require('pg')
const fs = require('fs')
const db = require('./database')
const client = db.client
const connect = db.connect
const query = db.query

const expressDataMapper = {
    // PostgreSQL queries
    console.log('Datamapper is running')
}



// Export the command
module.exports = {
    expressDataMapper
    }
