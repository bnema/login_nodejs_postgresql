
// --- Modules import ---
    const express = require('express')
    // We load our environment variables from the config.env file
    require('dotenv').config({ path: 'config.env' })
    const app = express()
    const PORT = process.env.devPORT
    const pg = require('pg')
    const localtunnel = require('localtunnel')
    const exphbs = require('express-handlebars')
    const fs = require('fs')
    const readFileSync = require('fs').readFileSync

    // Connection to the database (PostgreSQL)
    const client = new pg.Client({
        user : process.env.DB_USER,
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        password : process.env.DB_PASS,
        port : process.env.DB_PORT,
        // String on one line to avoid errors
        string: process.env.DATABASE_URL // UNDEFINED !!
    })
    // We set up the view engine
    app.set('view engine', 'handlebars')
    // We set up the public folder
    app.use(express.static('./express/src/public'))
    // We use the views folder for the view files
    app.set('./src/express/views', 'views')
// --- End of modules ---

// ---( Express - Configuration )---
// We connect to the database first and then start the server + tunnel
    client.connect()
    .then(() => {
        console.log(`Connected to the database \x1b[33m${process.env.DB_NAME}\x1b[0m with the user\x1b[33m ${process.env.DB_USER}\x1b[0m`)
    })

    // Then we start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port \x1b[33m${PORT}\x1b[0m`)
    })
    // We send "Hello World" to the client
    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    // Get the array of subdomainsList from the config./env file
    const subdomainsList = process.env.subdomainsList.split(',')
    // Log all the subdomains in the console
    console.log(subdomainsList)
    
    // Try all the subdomains in the array until one is available
    subdomainsList.forEach(subdomain => {
        localtunnel(PORT, { subdomain: subdomain }, (err, tunnel) => {
            if (err) {
                console.log(`\x1b[31mError\x1b[0m: ${err}`)
            } else {
                console.log(`\x1b[32mSuccess\x1b[0m: Your url is \x1b[33m${tunnel.url}\x1b[0m`)
            }
            // Close the tunnel when the process is closed
            tunnel.on('close', () => {
                console.log(`\x1b[31mTunnel\x1b[0m: closed`)
            })
        })
    })
// --- End of Express configuration ---