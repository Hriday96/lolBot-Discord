const Discord = require('discord.js');

module.exports.run = async (client, message, args, db) => {

  let embedResponse = new Discord.MessageEmbed()
  .setColor(8789534)
  .setTitle('Here is a list of the games currently in your wishlist');
  
  let currentWishlist;

  db.collection('users').doc(message.author.id).get().then(q => {
    if(q.exists) {
      currentWishlist = q.data().wishlist
    }
  }).then(() => {

    for (let i = 0; i < currentWishlist.length; i++) {
      embedResponse
        .addFields({
          name: `**${i + 1}**:`, value: `**${currentWishlist[i].name}**\nAppID: ${currentWishlist[i].appid}`, inline: true
        })
    }

    message.channel.send(embedResponse);

  })

 

}

module.exports.help = {
  name: 'list'
}