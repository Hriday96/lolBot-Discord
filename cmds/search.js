const Discord = require('discord.js');
const fs = require('fs');
const steamList = require('../steamAppList.json');

module.exports.run = async (client, message, args, db) => {

  userWishlistExists(message.author.id);

  let embedResponse = new Discord.MessageEmbed();

  let gameToSearch = '';
  let gameCounter = 1;

  let pre;

  db.collection('guilds').doc(message.guild.id).get().then((q) => {
    if(q.exists) {
      pre = q.data().prefix;
    }
  }).then(() => {

    for(let i = 0; i < args.length; i++){
      gameToSearch += args[i];
    }
  
    gameToSearch = gameToSearch.toLowerCase();
    gameToSearch = gameToSearch.replace(/[^a-zA-Z0-9]/g, '');

    let responseArr = [];

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '➡️'];

    
    const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;

    embedResponse
      .setColor(8789534)
      .setTitle('Here is a list of all the games I could find that match your search')
      .setDescription('After finding the game you are looking for, you can react with the number corresponding to its number in the list to add the game to your wishlist.');

  
    for (let i = 0; i < steamList.apps.length; i++){
  
      let gameDB = String(steamList.apps[i].name);
      gameDB = gameDB.toLowerCase();
      gameDB = gameDB.replace(/[^a-zA-Z0-9]/g, '');
  
      if (gameDB.includes(gameToSearch)) {
        responseArr.push(steamList.apps[i]);
      }
    }

    responseArr.forEach((item) => {
      item.length = item.name.length;
    })

    responseArr.sort(function(a, b){return a.length - b.length});

    let pages;
    let currentPage = 1;

    if(responseArr.length % 10 === 0) {
      pages = Math.floor(responseArr.length / 10);
    } else {
      pages = Math.floor(responseArr.length / 10) + 1;
    }

    

    if(responseArr.length <= 10) {
      for(let i = 0; i < responseArr.length; i++) {
          embedResponse.addFields({name: `${i + 1}:`, value: `Name: **${responseArr[i].name}**\nAppID: __${responseArr[i].appid}__`, inline: true});
      }

      message.channel.send(embedResponse).then(async msg => {
        for(let i = 0; i < responseArr.length; i++) {
          await msg.react(emojis[i]);
        }

        msg.awaitReactions(filter, {
          max: 1,
          time: 25000,
          errors: ['time']
        }).then(collected => {

          const reaction = collected.first();

          switch (reaction.emoji.name) {
            case '1️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[0].appid) === true) {
                message.channel.reply('this game is already in your wishlist');
              } else {
                addToWishlist(responseArr[0], message.author.id);
                message.channel.reply(`**${responseArr[0]}** was added to your wishlist!`);
              }
              break;
            case '2️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[1].appid) === true) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[1], message.author.id);
              }
              break;
            case '3️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[2].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[2], message.author.id);
              }
              break;
            case '4️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[3].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[3], message.author.id);
              }
              break;
            case '5️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[4].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[4], message.author.id);
              }
              break;
            case '6️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[5].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[5], message.author.id);
              }
              break;
            case '7️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[6].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[6], message.author.id);
              }
              break;
            case '8️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[7].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[7], message.author.id);
              }
              break;
            case '9️⃣':
              if(checkGameInWishlist(message.author.id, responseArr[8].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[8], message.author.id);
              }
              break;
            case '🔟':
              if(checkGameInWishlist(message.author.id, responseArr[9].appid)) {
                message.channel.reply('this game is already in your wishlist');
                break;
              } else {
                addToWishlist(responseArr[9], message.author.id);
              }
              break;
          }

        }).catch(collected => {

        })

      });
    } else {

      let offset = 0;
      let length = offset + 10;

      let currentPageArr = responseArr.slice(offset, length);

      for(let i = 0; i < currentPageArr.length; i++) {
        embedResponse
          .addFields({name: `${i + 1}:`, value: `Name: **${currentPageArr[i].name}**\nAppID: __${currentPageArr[i].appid}__`, inline: true})
          .setFooter(`You are currently on page ${currentPage} of ${pages}. Click on ➡️ to move to the next page`)
      }

    };
  });

  function userWishlistExists(userID) {
    db.collection('users').doc(userID).get().then(q => {
      if(!q.exists) {
        db.collection('users').doc(userID).set({
          'userID': userID,
          'wishlist': []
        });
        return;
      }
    });
  };

  function addToWishlist(gameToAdd, userID) {
    let userWishlistArr;
    
    db.collection('users').doc(userID).get().then(q => {
      if(q.exists) {
        userWishlistArr = q.data().wishlist;
      }
    }).then(() => {
      userWishlistArr.push(gameToAdd);

      db.collection('users').doc(userID).update({
        'wishlist': userWishlistArr
      });
    });
  }

  function checkGameInWishlist(userID, gameToAddID) {
    let dbWishlistArr;

    db.collection('users').doc(userID).get().then(async q => {

      dbWishlistArr = q.data().wishlist;
      
    }).then(() => {
      let existCheck = false;

      for(let i = 0; i < dbWishlistArr.length; i++) {

        console.log(i);

        if(dbWishlistArr[i].appid === gameToAddID) {
          existCheck = true;
          return existCheck;
        } else {
          existCheck = false;
          return existCheck;
        };
      }
      console.log(existCheck);
    })
  }

  async function existCheck(userID, appID) {
    try {
      const exist = await checkGameInWishlist(userID, appID)
      console.log(`${userID} - ${appID}`);
      console.log(exist);
      return exist;
    }
    catch(e) {
      return e;
    }
  }


}

module.exports.help = {
  name: 'search'
}