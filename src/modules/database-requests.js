const pg = require('pg')
const fs = require('fs')
const db = require('./src/modules/database')
const client = db.client
const Discord = require('discord.js');
// We load the local module discord.js
const discordBot = require('./src/modules/discord')

// We list all the members of the channel and we put them in an array
const members = message.guild.members.cache.map(member => member.user.tag)
// We create a string with all the members
const membersString = members.join('\n')
console.log(membersString)
// We create the embed
const embed = new Discord.MessageEmbed()
    .setColor('#00D1CD')
    .setTitle('Members')
    .setDescription(membersString)
    .setTimestamp()
    .setFooter('Members list')
// We send the embed
message.channel.send(embed)


// Export the command
module.exports = {
    members,
    membersString,
    embed
    }
