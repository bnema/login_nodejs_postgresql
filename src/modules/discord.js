require('dotenv').config({ path: 'config.env' })
const { GatewayIntentBits, PermissionFlagsBits, Client, Permissions, EmbedBuilder } = require('discord.js');
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
  let totalMembers
  let membersName
  let membersID

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
                    query(`INSERT INTO members (memberID, memberName, poopDaily, poopMonthly, poopYearly, poopOverall gmdj_selected) VALUES ('${membersID[i]}', '${membersName[i]}', 0, 0, 0, 0, 0)`, (err, res) => {
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

// We call the function poopCounter and poopCounterRemove
poopCounter()
poopCounterRemove()
 // reset the poopDaily to 0 every day at 00:00
function resetPoopDaily() {
     // Request the memberName and the poopDaily from the member with the highest poopDaily
     query(`SELECT * FROM members ORDER BY poopdaily DESC LIMIT 1`, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            // We get the memberName and the poopDaily
            PoopedUser = res.rows[0].membername
            poopDaily = res.rows[0].poopdaily
            PoopedUserID = res.rows[0].memberid
        
            const poopDailyEmbed = new Discord.EmbedBuilder()
            .setColor(15695665)
            .setAuthor({name: `Jean-Pierre Coffre`, iconURL: 'https://i.ibb.co/3db5Cm8/Capture-d-cran-2022-10-04-182145.jpg'})
            .setThumbnail(`https://i.imgur.com/kZKUzk4.png`)        
                .addFields(
                { name: `Bonjour les amis (et ${PoopedUser}) c'est Jean-Pierre Coffre !`,
                    value: "Je passe en coup de vent pour élire votre grosse merde du jour !",
                    inline: false },
                { name: `Et sans surprise c'est bien entendu cette grosse merde de ${PoopedUser} !`,
                    value: `Avec un total de ${poopDaily} :poop: sur sa sale gueule de merde ridicule...`,
                    inline: false
                },
                { name: "Je remets les compteurs à 0 et je repasse demain matin !",
                    value: `(Mais bon on sait tous que c'est "vous savez qui" qui va encore être élu demain.....Qu'elle belle merde celui ci quand même.)`,
                    inline: false}
                )
            channel.send({ embeds: [poopDailyEmbed] });
            // We add +1 to the row gmdj_selected
            query(`UPDATE members SET gmdj_selected = gmdj_selected + 1 WHERE memberid = '${PoopedUserID}'`, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                   // Console log how many time the user got selected 
                    query(`SELECT * FROM members WHERE memberid = '${PoopedUserID}'`, (err, res) => {
                        if (err) {
                            console.log(err.stack)
                        } else {
                            console.log(`${PoopedUser} a été sélectionné ${res.rows[0].gmdj_selected} fois`)
                            // We send the result of the console log in the channel
                            channel.send(`${PoopedUser} a été une grosse merde du jour ${res.rows[0].gmdj_selected} fois`)


                        }
                        
                    }
                    )

                }
            })
            // We reset the poopDaily to 0
            query(`UPDATE members SET poopDaily = 0`, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    console.log('poopDaily reset to 0')
                }
            })
        }
    })
}
 

// We call the function resetPoopDaily with the cron job (every day at 09:00)
cron.schedule('0 9 * * *', () => {
    resetPoopDaily()
})

// Or with the command !resetpoopdaily
clientBot.on('messageCreate', message => {
        if (message.content === '!debugrpd') {
            // We define message.channel.send as channel
            channel = message.channel
            resetPoopDaily()
        }
})


// With the command !addpoop we add 1 add the end of the nickname member
clientBot.on('messageCreate',  message =>  {
    const guild = clientBot.guilds.cache.find(guild => guild.name === "On adore jouer");
    if (message.content === '!addpoop') {
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