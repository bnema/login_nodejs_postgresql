require('dotenv').config({ path: 'config.env' })
const { GatewayIntentBits, PermissionFlagsBits, Client, Permissions, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const { poll } = require('discord.js-qotd');
// Load module database
const db = require('./database')
const client = db.client
const connect = db.connect
const query = db.query
const end = async () => {
    await client.end()
}

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
  let totalMembers
  let membersName
  let membersID

clientBot.on('ready', () => {
    console.log(`DiscordBot logged in as \x1b[33m${clientBot.user.tag}\x1b[0m`)
        // Find the guild ID that contain the name "On adore jouer  
    const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
    // Console log the guild ID
    const guildID = guild.id
    // Fetch all members of guildID
    guild.members.fetch().then(fetchedMembers => {
        totalMembers = fetchedMembers.size;
        membersName = fetchedMembers.map(member => member.user.username);
        membersID = fetchedMembers.map(member => member.user.id);
        // In the database we create a table called members
        query(`CREATE TABLE IF NOT EXISTS members (id SERIAL PRIMARY KEY, memberID VARCHAR(255), memberName VARCHAR(255), poopDaily INTEGER, poopMonthly INTEGER, poopYearly INTEGER, poopOverall INTEGER)`, (err, res) => {
            // If successful we console log the table
            if (err) {
                console.log(err.stack)
            } else {
        // We loop through the membersName array
        for (let i = 0; i < membersName.length; i++) {
            // We check if the memberName is already in the database
            query(`SELECT * FROM members WHERE memberName = '${membersName[i]}'`, (err, res) => {
                if (err) {
                    console.log(err.stack)
                }
                // If the memberName is not in the database we add it
                if (res.rows.length === 0) {
                    query(`INSERT INTO members (memberID, memberName, poopDaily, poopMonthly, poopYearly, poopOverall) VALUES ('${membersID[i]}', '${membersName[i]}', 0, 0, 0, 0)`, (err, res) => {
                    if (err) {
                            console.log(err.stack)
                        }
                        })
                    }
                })
                }
                }
        }),
        // We consol log the table members
        query(`SELECT * FROM members`, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.table(res.rows)
            }
        })
        })
});
// COnsole log the message
clientBot.on('messageCreate', message => {
    console.log(message.author.username + ' say: ' + message.content);
     // Ignore messages from other bots
    if (message.author.bot) return;

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
    });
// function async poopCounter
async function poopCounter() {
// Listen to reaction :poop:
clientBot.on('messageReactionAdd', async (reaction, user, message) => {
    PoopedUser = reaction.message.author.username
    PoopedID = reaction.message.author.id
    channel = reaction.message.channel

    if (reaction.emoji.name === '💩') {
        // Console log who got pooped
        console.log(PoopedUser + ' got pooped')
        // We check if the memberName is already in the database
        query(`SELECT * FROM members WHERE memberName = '${PoopedUser}'`, (err, res) => {
            if (err) {
                console.log(err.stack)
            }          
            }
        )
        // We add 1 to the poopDaily poopMonthly poopYearly poopOverall
        query(`UPDATE members SET poopDaily = poopDaily + 1, poopMonthly = poopMonthly + 1, poopYearly = poopYearly + 1, poopOverall = poopOverall + 1 WHERE memberid = '${PoopedID}'`, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                // Console log the row of the memberName
                query(`SELECT * FROM members WHERE memberName = '${PoopedUser}'`, (err, res) => {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        console.table(res.rows)
                        // Send the poopDaily poopMonthly poopYearly poopOverall from the user
                        poopDaily = res.rows[0].poopdaily
                        poopMonthly = res.rows[0].poopmonthly
                        poopYearly = res.rows[0].poopyearly
                        poopOverall = res.rows[0].poopoverall
                        // We send a message in the channel
                        console.log(`${PoopedUser} a été une merde  ${poopDaily} fois aujourd'hui, ${poopMonthly} fois ce mois-ci, ${poopYearly} fois cette année et ${poopOverall} fois au total`)
                        
                    }
                })
            }
        })
    }
})
}
// If the user remove his reaction :poop: we remove 1 to the poopDaily poopMonthly poopYearly poopOverall
async function poopCounterRemove() {
clientBot.on('messageReactionRemove', async (reaction, user, message) => {
    PoopedUser = reaction.message.author.username
    PoopedID = reaction.message.author.id
    channel = reaction.message.channel
    if (reaction.emoji.name === '💩') {
        query(`UPDATE members SET poopDaily = poopDaily - 1, poopMonthly = poopMonthly - 1, poopYearly = poopYearly - 1, poopOverall = poopOverall - 1 WHERE memberid = '${PoopedID}'`, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                channel.send(`${PoopedUser} a été dépoopé par ${user.username}`)
            }
    })
}})
}

// We call the function poopCounter and poopCounterRemove that depend on it to work
poopCounter()
poopCounterRemove()


// Client login  
clientBot.login(process.env.discordBotToken)
    // Export the client
    module.exports = {
        discordBot : clientBot
    }