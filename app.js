// Serveur Express - NodeJS
const express = require('express')
const app = express()
const pg = require('pg')
const exphbs = require('express-handlebars')
const fs = require('fs')
const readFileSync = require('fs').readFileSync
// On charge lke fichier // env/express_config.env
const env = require('dotenv').config({path: './env/express_config.env'})
const port = process.env.devPORT
// On a besoin de la base de donnée PostgreSQL
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
// // On utilise le https
// const https = require('https')
// // On démarre le serveur en https
// https.createServer({
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// }, app).listen(port, () => {
//     console.log(`Serveur démarré sur le port ${port}`)
// })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`le serveur tourne sur le port ${port}`)
})
 // --------------------------------------------------
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
