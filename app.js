
// --- Global modules import ---
    const express = require('express')
    // We load our environment variables from the config.env file
    require('dotenv').config({ path: 'config.env' })
    // We load our modules from the config.env file
   const app = express()
    const PORT = process.env.devPORT
    const pg = require('pg')
    const exphbs = require('express-handlebars')
    const fs = require('fs')
    const Discord = require('discord.js');
    const { Client, GatewayIntentBits, Webhook, } = require('discord.js');
    const readFileSync = require('fs').readFileSync
    // Local database-requests module
    const db = require('./src/modules/database')
    const client = db.client
// --- End of global modules ---
// --- Local modules import ---
    // Localtunnel
    const localtunnel = require('./src/modules/localtunnel')
    const tunnel = localtunnel.tunnel
    // Discord bot
    const discordBot= require('./src/modules/discord')
    const clientBot = discordBot.clientBot

// --- End of local modules ---

// --- Express configuration ---
    // We set up the view engine
    app.set('view engine', 'handlebars')
    // We set up the public folder
    app.use(express.static('./express/src/public'))
    // We use the views folder for the view files
    app.set('./src/express/views', 'views')
// --- End of express configuration ---

// ---( Express - Configuration )---
// We try connect to the database first and then start the server + tunnel
    client.connect()
    .then(() => {
        console.log(`Connected to the database \x1b[33m${process.env.DB_NAME}\x1b[0m with the user\x1b[33m ${process.env.DB_USER}\x1b[0m`)
        // If there is an error we log it
        client.on('error', err => {
            console.log(`Error while connecting to the database`,err)
        })
        client.end()
    }) 
    // Then we start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port \x1b[33m${PORT}\x1b[0m`)
    })
    // We send "Hello World" to the client
    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    // When SIGINT is received we close nodejs
    process.on('SIGINT', () => {
        // We close the tunnel
        console.log(' ')
        tunnel.close()
        console.log('Tunnel closed')
        console.log('SIGINT signal received: closing HTTP server')
        // We close the tunnel
        process.exit()
    })
                
// --- End of Express configuration ---