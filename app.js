// ---( Serveur Express - NodeJS )---
// Les modules
    const express = require('express')
    const app = express()
    const pg = require('pg')
    const port = process.env.devPORT
    //  Connexion à la base de données
    const exphbs = require('express-handlebars')
    const fs = require('fs')
    const readFileSync = require('fs').readFileSync
    // On charge le fichier de config Express 
    const env = require('dotenv').config({path: './env/express_config.env'})
    // On charge le fichier de config de la base de données
    const db = require('dotenv').config({path: './env/db_config.env'})
    // On a besoin de la base de donnée PostgreSQL
    const { Client } = require('pg')
    const client = new Client({
        user: process.env.dbUSER,
        host: process.env.dbHOST,
        database: process.env.dbDATABASE,
        password: process.env.dbPASSWORD,
        port: process.env.dbPORT,
    })
// --- Fin des modules ---


// ---( PostgresSQL - Connexion )---
    // On se connecte à la base de données
    client.connect()
    // Si la connexion échoue, on affiche l'erreur sinon on affiche un message de succès
    client.on('error', (err) => {
        console.log('Erreur de connexion à la base de données', err)
    })
    client.on('connect', () => {
        console.log('Connexion à la base de données réussie')
    })
    // On envoie une requête à la base de données
    client.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        client.end()
    })
// --- Fin de la connexion ---


// ---( Express - Configuration )---
    app.get('/', (req, res) => {
        res.send('Hello World!')
        })
    app.listen(port, () => {
    console.log(`le serveur tourne sur le port ${port}`)
    })
// --- Fin de la configuration ---


// ---( Lancement du serveur localtunnel)---
    // When the server is started we start the localtunnel service
    const localtunnel = require('localtunnel')
    // and print the public URL to the console with the subdomain from the .env file
    const tunnel = localtunnel({ port: process.env.devPORT, subdomain: process.env.devSUBDOMAIN }, (err, tunnel) => {
            // subdomain
    
            if (err) {
                console.error(err)
                process.exit(1)
            }

            console.log(`Tunnel URL: ${tunnel.url}`)
        }
    )
// --- Fin du lancement ---
