require('dotenv').config({ path: 'config.env' })
const { GatewayIntentBits, PermissionFlagsBits, Client, Permissions, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const { poll } = require('discord.js-qotd');
// Load module database
const db = require('./database')
const client = db.client
const dbRequest = require('./database-requests')
const members = dbRequest.members

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
    ]
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
    console.log(`DiscordBot logged in as \x1b[33m${clientBot.user.tag}\x1b[0m`)
        // Find the guild ID that contain the name "On adore jouer  
const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
// Console log the guild ID
const guildID = guild.id
// Fetch all members of guildID
guild.members.fetch().then(fetchedMembers => {
const totalMembers = fetchedMembers.size;
const membersName = fetchedMembers.map(member => member.user.username);
console.log(membersName);
});

})

clientBot.on('messageCreate', message => {
    console.log(message.author.username + ' say: ' + message.content);
    // List all users in the guild "On adore jouer"
     // Ignore messages from other bots
    if (message.author.bot) return;
    antiSpam.message(message);

   if (message.author.bot) return;
    // If the message is "ping"
    // if (message.content === 'coucou les amis') {
    //     // We reply "@user : the message"
    //     message.reply(`Tu me donnes envie de vomir avec ton ${message.content}, espèce de merde !`);
    // };
    // // If message content contains "mdr" or "lol" or "haha"
    // if (message.content.includes('mdr') || message.content.includes('lol') || message.content.includes('haha')) {
    //     // We reply "@user : the message"
    //     message.reply(`Tu me donnes envie de vomir avec ton ${message.content}, espèce de merde !`);
    // };
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
    function poopCounter() {
        
        clientBot.on('messageReactionAdd', (reaction, user, message) => {
            
           // If this is the bot's reaction, ignore it
              if (user.bot) return;
            // We create an empty array with "users" "count" and "emoji"
            const channel = reaction.message.channel;// channel = current channel
            // Create a variable for the user who created the message
            const userPooped = reaction.message.author.username;
           // If the reaction is poop emoji and the user is not a bot we add the user to the array and add 1 to the counter
            if (reaction.emoji.name === poopCounter.emoji && !user.bot) {
                // Crean an array with 3 values
                const poopCounter= [reaction.message.author.username, 1, poopCounter.emoji];
                console.log(poopCounter)
                poopCounter.users.push(reaction.message.author.username);
                // Console log who got added to the array
                console.log(`${userPooped} got added to the array`)
                poopCounter.count++;
                // Console log the counter of the userPooped
                console.log(`${userPooped} got ${poopCounter.count} poop`)
                // Add the user to the array
                // Add 1 to the counter
                // Send a message in the channel
                channel.send(`${userPooped} a chié ${poopCounter.count}`);
                // For each user who add a poop emoji we add +1 to the counter of reaction.message.author.username

            // If a poop is removed we remove 1 to the counter
            if (reaction.emoji.name === poopCounter.emoji && !user.bot) {
                poopCounter.count--;
                // Console log the user who reacted and the counter
                console.log(`${userPooped} compteur: ${poopCounter.count}`);
    // End
            }
        }
    })
}
            
    poopCounter()
})


// Client login  
clientBot.login(process.env.discordBotToken)
    // Export the client
    module.exports = {
        discordBot : clientBot
    }