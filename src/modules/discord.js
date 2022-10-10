require('dotenv').config({ path: 'config.env' })
const { GatewayIntentBits, PermissionFlagsBits, Client, Permissions, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const { poll } = require('discord.js-qotd');
const db = require('./src/modules/database')
const client = db.client
module.exports = {
	name: 'qotd',
	description: 'Create a qeustion of the day embed.',
	usage: 'Title + Option 1 + Option 2 + Option 3 + etc',
	execute(client, message, args) {
		poll(message, args, '+', '#00D1CD', "🤷‍♂️");
	},
};
const clientBot = new Discord.Client({
    intents:
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    permissions: [
        PermissionFlagsBits.Administrator
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    presence: {
        status: 'online',
        activities: [
            {
                name: 'with the code',
                type: 'PLAYING'
            }
        ]
    }
})
const AntiSpam = require("discord-anti-spam");
const antiSpam = new AntiSpam({
    warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
    muteTreshold: 6, // Amount of messages sent in a row that will cause a mute.
    kickTreshold: 90, // Amount of messages sent in a row that will cause a kick.
    banTreshold: 120, // Amount of messages sent in a row that will cause a ban.
    warnMessage: "Stop spamming!", // Message sent in the channel when a user is warned.
    muteMessage: "You have been muted for spamming!", // Message sent in the channel when a user is muted.
    kickMessage: "You have been kicked for spamming!", // Message sent in the channel when a user is kicked.
    banMessage: "You have been banned for spamming!", // Message sent in the channel when a user is banned.
    unMuteTime: 60, // Time in minutes before the user will be able to send messages again.
    verbose: true, // Whether or not to log every action in the console.
    removeMessages: true, // Whether or not to remove all messages sent by the user. // For more options, see the documentation:
  });

clientBot.on('ready', () => {
    console.log(`Logged in as \x1b[33m${clientBot.user.tag}\x1b[0m`)
    // List all users connected to the bot
    clientBot.guilds.cache.forEach((guild) => {
        console.log(guild.name)
        guild.members.cache.forEach((member) => {
            console.log(` - ${member.user.tag}`)
        })
    })
})


clientBot.on('messageCreate', message => {
    console.log('Message received! Message content: ' + message.content);
    // Use the variable membersString from the module discord.js
    const { membersString } = require('./src/modules/discord.js')
    console.log(membersString)
   // Ignore messages from other bots
   // Check if the user is spamming else ignore
    if (message.author.bot) return;
    antiSpam.message(message);

   if (message.author.bot) return;
    // If the message is "ping"
    if (message.content === 'coucou les amis') {
        // We reply "@user : the message"
        message.reply(`Tu me donnes envie de vomir avec ton ${message.content}, espèce de merde !`);
    };
    // If message content contains "mdr" or "lol" or "haha"
    if (message.content.includes('mdr') || message.content.includes('lol') || message.content.includes('haha')) {
        // We reply "@user : the message"
        message.reply(`Tu me donnes envie de vomir avec ton ${message.content}, espèce de merde !`);
    };
    if (message.content === '!whoami') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
        // Send the message content
        message.channel.send(`Your message: ${message.content}`);
    }
    if (message.content === '!gmdj') {
        const poll = new Discord.EmbedBuilder()
        .setDescription(`Alors qui mérite d'être la grosse merde du jour?`)
        .setColor(0x00D1CD)
        message.channel.send({ embeds: [poll] }).then(messageReaction => {
            messageReaction.react('👍');
            messageReaction.react('👎');
        });
    }
    // When a user send the message "!poll" we create a question of the day
})

// Client login  
clientBot.login(process.env.discordBotToken)

    // Export the client
    module.exports = {
        clientBot
    }