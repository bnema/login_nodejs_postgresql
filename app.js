
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
    const connect = db.connect
    const query = db.query
// --- End of global modules ---
// --- Local modules import --- //////// Not useful disabled

    // // Localtunnel
    // const localtunnel = require('./src/modules/localtunnel')
    // // We start the tunnel, if there an arror we log it but we don't stop the server
    // localtunnel.on('error', err => {
    //     console.log('Error while creating the tunnel', err)
    // })

    // const tunnel = localtunnel.tunnel

    // --- Discord modules import ---
    // const discordBot= require('./src/modules/discord') <---- Disabled temporarily
    // const clientBot = discordBot.clientBot

// --- End of local modules ---


// --- Express configuration ---
    // We set up the view engine
    app.set('view engine', 'handlebars')
    // We set up the public folder
    app.use(express.static('./src/express/public'))
    // We use the views folder for the view files
    app.set('./src/express/views', 'views')
    // We set up the handlebars engine
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: './src/express/views/layouts',
        partialsDir: './src/express/views/partials'
    }))
    // We set up the body parser
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    // We set up the session
    const session = require('express-session')
    const pgSession = require('connect-pg-simple')(session)
    app.use(session({
        store: new pgSession({
            pool: client,
            tableName: 'session'
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }
    }))
    // we use our routes
    app.use('/', require('./src/express/routes/mainRouter'))
        
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
    }) 
    // Then we start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port \x1b[33m${PORT}\x1b[0m`)
    })
    // We send "Hello World" to the client
    // When SIGINT is received we close nodejs
    process.on('SIGINT', () => {
        // We close the tunnel
        console.log(' ')
        // tunnel.close()
        console.log('Tunnel closed')
        console.log('SIGINT signal received: closing HTTP server')
        // We close the tunnel
        process.exit()
    })
                
// --- End of Express configuration ---