const localtunnel = require('localtunnel')
require('dotenv').config({ path: 'config.env' })
const PORT = process.env.devPORT

// Load our array of subdomains
function loadSubdomains() {
    // We load the subdomains from the file config.env
    const subdomains = process.env.subdomainsList.split(',')
    // for Each subdomain we request to localtunnel if it is available
    subdomains.forEach(subdomain => {
        // We request to localtunnel if the subdomain is available
        localtunnel({ port: PORT, subdomain: subdomain }, (err, tunnel) => {
            if (err) {
                console.log(`The subdomain \x1b[33m${subdomain}\x1b[0m is not available`)
            } else {
                console.log(`The subdomain \x1b[33m${subdomain}\x1b[0m is available`)
            }
        const tunnelUrl = tunnel.url
        console.log(`The tunnel is available at \x1b[33m${tunnelUrl}\x1b[0m`)
        })
    })
}
 // Console log the result of the function

// We try the function
loadSubdomains()
console.log(loadSubdomains())


    // We create the tunnel with the random subdomain
    const tunnel = localtunnel(PORT, { subdomain: 'bnema' }, (err, tunnel) => {
        console.log(`Tunnel url is: \x1b[33m${tunnel.url}\x1b[0m`)
        if (err) {
            console.log('Error while creating the tunnel', err)
        }
    })


   // Export the const tunnel
    module.exports = tunnel