function resetPoopDaily(message) {   
    // Request the memberName and the poopDaily from the member with the highest poopDaily
   query(`SELECT * FROM members ORDER BY poopdaily DESC LIMIT 1`, (err, res) => {
       if (err) {
           console.log(err.stack)
       } else {
           // We get the memberName and the poopDaily
           poopedUserName = res.rows[0].membername
           poopDaily = res.rows[0].poopdaily
           poopedUserID = res.rows[0].memberid
           gmdj_selected = res.rows[0].gmdj_selected
           
           // channel.send({ embeds: [poopDailyEmbed] });
           // We add +1 to the row gmdj_selected
           query(`UPDATE members SET gmdj_selected = gmdj_selected + 1 WHERE memberid = '${poopedUserID}'`, (err, res) => {
           // query count oh many gmdj_selected the pooped user have
           
           })
           const poopDailyEmbed = new Discord.EmbedBuilder()
           .setColor(15695665)
           .setAuthor({name: `Jean-Pierre Coffre`, iconURL: 'https://i.ibb.co/3db5Cm8/Capture-d-cran-2022-10-04-182145.jpg'})
           .setThumbnail(`https://i.imgur.com/kZKUzk4.png`)        
           .addFields(
           { name: `Bonjour les amis (et ${poopedUserName}) c'est Jean-Pierre Coffre !`,
             value: "Je passe en coup de vent pour élire votre grosse merde du jour !",
             inline: false },
           { name: `Et sans surprise c'est bien entendu cette grosse merde de ${poopedUserName} !`,
             value: `Avec un total de ${poopDaily} :poop: sur la journée d'hier, quelle merde...`,
             inline: false
           },
           { name: `Ne pas oublier que c'est la ${gmdj_selected}e fois qu'il est élu grosse merde !`,
             value: `\u200B`,
             inline: false
           })
           .setFooter( 
           { text: `${poopedUserName} a été ajouté au rôle grosse merde pour 10 seconds ! Les compteurs ont été remis à 0` }
           )
           console.log(message.channel.send)
               message.channel.send({ embeds: [poopDailyEmbed] })
               
               let roleGM = message.guild.roles.cache.find(r => r.name === "GROSSE MERDE");
               if (err) {
                   console.log(err.stack) }
                   // We add the role GROSSE MERDE to the pooped user
                   
                   message.guild.members.cache.get(poopedUserID).roles.add(roleGM);
                   // We remove the role GROSSE MERDE to the pooped user after 10 seconds
           
               // We reset the poopDaily to 0
               query(`UPDATE members SET poopdaily = 0`, (err, res) => {
                   if (err) {
                       console.log(err.stack)
                   }
                   console.log('Les compteurs ont été remis à 0')
               })
               setTimeout(()=> { 
                message.guild.members.cache.get(poopedUserID).roles.remove(roleGM);
               }, 10000);
               setTimeout(()=> {
               message.channel.send(`Role grosse merde retiré pour ${poopedUserName}`)
               }, 10000);
       }
   })
}