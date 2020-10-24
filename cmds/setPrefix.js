module.exports.run = async (client, message, args, db) => {

  var ownerID;
  db.collection('guilds').doc(message.guild.id).get().then((q) => {
    if(q.exists) {
      ownerID = q.data().guildOwnerID;

      if(!args[0]) {
        message.channel.send('Not a valid command');
      } else if(args[0]) {

          if (message.author.id !== ownerID) {
            message.channel.send('Only the server owner can change the prefix!');
          } else if (message.author.id === ownerID && args[0].length === 1) {
        
              let nPrefix = args[0];
        
              db.collection('guilds').doc(message.guild.id).update({
                'prefix': nPrefix
              }).then(() => {
                message.channel.send(`[prefix update]: New Prefix "${nPrefix}"`);
              });
          } else if (message.author.id === ownerID && args[0].length > 1) {
              message.channel.send('Please enter a single character as prefix!');
          } else if (message.author.id === ownerID && args[0].length === 0) {
              message.channel.send('Missing prefix!')
          } else if (message.author.id === ownerID && args[0] === ' ') {
              message.channel.send('Not a valid prefix')
        } 
      }
    }
  })
}

module.exports.help = {
  name: 'setPrefix'
}