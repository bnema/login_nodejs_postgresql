require('dotenv').config({ path: 'config.env' })
const { GatewayIntentBits, PermissionFlagsBits, Client, Permissions, EmbedBuilder, roles } = require('discord.js');
require('date');
const Discord = require('discord.js');
const { poll } = require('discord.js-qotd');
const cron = require('node-cron');
// Load module database
const db = require('./database')
const client = db.client
const connect = db.connect
const query = db.query
const end = async () => {
    await client.end()
}
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
    Permissions: [
        PermissionFlagsBits.ADMINISTRATOR
    ]

})

  
  let serverID = '861554459427864606'
  let channelInsultID = '965650799474671686'
  let channelInsultName = 'insultes'
  let roleGrosseMerdeID = '1020005900443992094'

clientBot.on('ready', () => {
    console.log(`DiscordBot logged in as \x1b[33m${clientBot.user.tag}\x1b[0m`)

    clientBot.user.setPresence({ type: 'WATCHING', activities: [{ name: '👀 surveiller les merdes' }], status: 'online' })
   
        // Find the guild ID that contain the name "On adore jouer  
    const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
    // Console log the guild ID
    const guildID = guild.id
    // Fetch all members of guildID
    guild.members.fetch().then(fetchedMembers => {
        totalMembers = fetchedMembers.size;
        membersName = fetchedMembers.map(member => member.user.username);
        membersID = fetchedMembers.map(member => member.user.id);
        //  ICI IL ME LE PRINT console.log(membersNickname)
        // In the database we create a table called members
        query(`CREATE TABLE IF NOT EXISTS members (id SERIAL PRIMARY KEY, memberID VARCHAR(255), memberName VARCHAR(255), poopDaily INTEGER, poopMonthly INTEGER, poopYearly INTEGER, poopOverall INTEGER, gmdj_selected INTEGER)`, (err, res) => {
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
                    query(`INSERT INTO members (memberID, memberName, poopDaily, poopMonthly, poopYearly, poopOverall, gmdj_selected) VALUES ('${membersID[i]}', '${membersName[i]}', 0, 0, 0, 0, 0)`, (err, res) => {
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
                // console.table(res.rows)
            }
        })
        })
});
let queryMostPoopedUserDaily = `SELECT * FROM members ORDER BY poopDaily DESC LIMIT 1`
let queryMostPoopedUserMonthly = `SELECT * FROM members ORDER BY poopMonthly DESC LIMIT 1`
let queryMostPoopedUserYearly = `SELECT * FROM members ORDER BY poopYearly DESC LIMIT 1`
let queryMostPoopedUserOverall = `SELECT * FROM members ORDER BY poopOverall DESC LIMIT 1`
// Command !whoi
clientBot.on('messageCreate', message => {
    console.log(message.author.username + ' say: ' + message.content);
     // Ignore messages from other bots
    if (message.author.bot) return;

    if (message.content === '!whoami') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
        // Send the message content
        message.channel.send(`Your message: ${message.content}`);
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
        // Set presence +1 poop to the pooped user for 5 seconds then go back to normal
        clientBot.user.setPresence({ type: 'WATCHING', activities: [{ name: `+1 💩 pour ${PoopedUser}` }], status: 'BUSY' })
        setTimeout(() => {
            clientBot.user.setPresence({ type: 'WATCHING', activities: [{ name: '👀 surveiller les merdes' }], status: 'online' })
        }, 2000);
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
        // If PoopedUser is a bot we ignore
        // Then return
        query(`UPDATE members SET poopDaily = poopDaily - 1, poopMonthly = poopMonthly - 1, poopYearly = poopYearly - 1, poopOverall = poopOverall - 1 WHERE memberid = '${PoopedID}'`, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(`${PoopedUser}a été dépoopé par ${user.username}`)
            }
    })
}})
}
// We call the function poopCounter
poopCounter()
poopCounterRemove()




function dailyPoopMessageReward() {
    // before sending the embed we remove the role grosse merde to the pooped user
    clientBot.guilds.cache.get(serverID).members.cache.get(mostPoopedUserDailyID).roles.remove(roleGrosseMerdeID)
    // We get our embed message and send it in the channel channelInsultID

    query(`SELECT * FROM members ORDER BY poopdaily DESC LIMIT 1`, (err, res) => {
        if (err) {console.log(err.stack)}
        
            mostPoopedUserDaily = res.rows[0].membername
            mostPoopedUserDailyPoop = res.rows[0].poopdaily
            mostPoopedUserDailyID = res.rows[0].memberid
            mostPoopedUserGMDJ = res.rows[0].gmdj_selected           
        })
        const poopDailyEmbed = new Discord.EmbedBuilder()
        .setColor(15695665)
        .setAuthor({name: `Jean-Pierre Coffre`, iconURL: 'https://i.ibb.co/3db5Cm8/Capture-d-cran-2022-10-04-182145.jpg'})
        .setThumbnail(`https://i.imgur.com/kZKUzk4.png`)        
        .addFields(
           { name: `Bonjour les amis (et ${mostPoopedUserDaily}) c'est Jean-Pierre Coffre !`,
             value: "Je passe en coup de vent pour élire votre grosse merde du jour !",
             inline: false },
           { name: `Et sans surprise c'est bien entendu cette grosse merde de ${mostPoopedUserDaily} !`,
             value: `Avec un total de ${mostPoopedUserDailyPoop} :poop: sur la journée d'hier, quelle merde...`,
             inline: false
           },
           { name: `Ne pas oublier que c'est la ${mostPoopedUserGMDJ}e fois qu'il est élu grosse merde !`,
             value: `\u200B`,
             inline: false
           })
        .setFooter( 
           { text: `${mostPoopedUserDaily} a été ajouté au rôle grosse merde pour 10 seconds ! Les compteurs ont été remis à 0` }
           )
        clientBot.channels.cache.get(channelInsultID).send(poopDailyEmbed)
}

function resetPoopDaily() {
    // Reset the poopDaily to 0
    query(`UPDATE members SET poopDaily = 0`, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log('poopDaily reset')
        }
    })
    // Then we add +1 to gmdj_selected to the new most pooped user
    query(`UPDATE members SET gmdj_selected = gmdj_selected + 1 WHERE memberid = '${poopedUserID}'`, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log('gmdj_selected +1')
        }
    })
    // We add the role grosse merde to the pooped user
    clientBot.guilds.cache.get(serverID).members.cache.get(mostPoopedUserDailyID).roles.add(roleGrosseMerdeID)
    // We console log the new most pooped user
    console.log(`Role grosse merde ajouté à ${mostPoopedUserDaily}`)
}

// We call the function resetPoopDaily with a cron job
// Every day at 00:00:00
cron.schedule('31 23 * * *', () => {
// client bot on ready 
clientBot.on('ready', () => {
    // We call the function dailyPoopMessageReward
    dailyPoopMessageReward()
    // We call the function resetPoopDaily
    resetPoopDaily()
})
})



//We call the function resetPoopDaily from the command !resetpoopdaily
// Create !viewrole command
clientBot.on('messageCreate', (message, user) => {
    channel = message.channel
    if (message.content === '!resetpoopdaily') {
        resetPoopDaily(message)
    }

    
    // let member = the one that posted the message
    const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
    let member = message.mentions.members.first();
    let poopRole = message.guild.roles.cache.find(r => r.name === "GROSSE MERDE");
    let poopRoleMembers = poopRole.members.map(m=>m.user.username).join(', ')
    // if error we log it
    if (message.content === '!viewrole'){
        channel.send(`Voici la liste des rôles que vous avez : ${member.roles.cache.map(r => r.name).join(', ')}`)
    }
    // Avec la commande ! viewgm on affiche tous les membres qui ont le rôle grosse merde
    // If the user is admin he can use those commands
    if (message.member.roles.cache.has("1027911491594227802")) {
        // If message.content === !addpooprole + @user we add the role grosse merde to the user
        if (message.content.startsWith('!addpooprole')) {
            member.roles.add(poopRole)
            channel.send(`${member} a été ajouté au rôle grosse merde`)
        }
 
        if (message.content.startsWith('!removepooprole')){
            // Then remove the poopRole to the member who posted the message
            member.roles.remove(poopRole)
            // Send a message in the channel
            channel.send(`${member} n'a plus le rôle grosse merde !`)
        }

    }
    // If command !viewgm we send a message with the list of all the members who have the role grosse merde
    if (message.content === '!meilleurecommande') {
        // If the user is "@Pryda" we say "you cannot use this command"
        if (message.member.id === "140175502143913985") {
            channel.send(`Mdr tu as cru que tu pouvais utiliser cette commande toi ? Je ne crois pas non, tiens sois plutôt une grosse merde du jour !`)
            member.roles.add(poopRole)
            channel.send(`${member} a été ajouté au rôle grosse merde`)
        } else {
        channel.send(`Elle est pas délicieuse cette commande ? Je l'adore moi personnellement !`)
    }
    }
    if  (message.content.startsWith('!addpoop')) {
        guild.members.fetch().then(fetchedMembers => {
            // We define the nickname as memberNickname
            membersNickname = fetchedMembers.map(member => member.nickname);
            membersID = fetchedMembers.map(member => member.user.id);
            // We get the nickname of the user mentioned
            memberNickname = message.mentions.members.first().nickname
            // We get the ID of the user mentioned
            memberID = message.mentions.members.first().user.id
            console.log (memberNickname)
            console.log (memberID)
            // // Send the nickname of the member who used the command in the channel
            // member.setNickname(`${member.nickname}💩`)
            // channel.send(`J'ai jouté 1 💩 à la fin du nickname de ${message.author.username}`)

        })
    }

    // Command for everyoe
})

// With the command !addpoop we add 1 poop the end of the nickname member
clientBot.on('messageCreate',  message =>  {
    const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
    if (message.content === '!addpoopy') {
        // Command addpoop logged in the console
        console.log(`${message.author.username} a utilisé la commande !addpoop`)
        // We define message.channel.send as channel
        channel = message.channel
        // We fetch in the guild the member who used the command and his nickname
        guild.members.fetch().then(fetchedMembers => {
            // We define the nickname as memberNickname
            membersNickname = fetchedMembers.map(member => member.nickname);
            membersID = fetchedMembers.map(member => member.user.id);
            member = fetchedMembers.get(message.author.id)
            // Send the nickname of the member who used the command in the channel
            channel.send(`Le nickname de ${message.author.username} est ${member.nickname}`)
            // We add 1 to the end of the nickname
            member.setNickname(`${member.nickname}💩`)
            channel.send(`J'ai jouté 1 💩 à la fin du nickname de ${message.author.username}`)

        })
        // Console log the nickname of the member who used the command
           
        
    }
})


//------------------------------- Client login -------------------------------//

clientBot.login(process.env.discordBotToken)
    // Export the client
    module.exports = {
        discordBot : clientBot
    }