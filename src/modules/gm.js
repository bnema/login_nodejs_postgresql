// --- Global modules import ---
const express = require('express')
// We load our environment variables from the config.env file
require('dotenv').config({ path: 'config.env' })
const app = express()
const PORT = process.env.devPORT
const pg = require('pg')
const exphbs = require('express-handlebars')
const fs = require('fs')
const { DiscordAPIError } = require('discord.js')
const readFileSync = require('fs').readFileSync
// --- End of global modules ---

// --- Export the modules ---
module.exports = {
    express,
    app,
    PORT,
    pg,
    exphbs,
    fs,
    DiscordAPIError,
    readFileSync
}
// --- End of export ---