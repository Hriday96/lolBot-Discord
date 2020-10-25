const Discord = require('discord.js');
const fs = require('fs');
const steamList = require('../steamAppList.json');

module.exports.run = async (client, message, args, db) => {

  let embedResponse = new Discord.MessageEmbed();
  
  let embedResponse2 = new Discord.MessageEmbed();

  let embedResponse3 = new Discord.MessageEmbed();



  let gameToSearch = '';
  let gameCounter = 1;

  for(let i = 0; i < args.length; i++){
    gameToSearch += args[i];
  }

  gameToSearch = gameToSearch.toLowerCase();
  gameToSearch = gameToSearch.replace(/[^a-zA-Z0-9]/g, '');

  //console.log(steamList.apps.length);

  for (let i = 0; i < steamList.apps.length; i++){

    let gameDB = String(steamList.apps[i].name);

    gameDB = gameDB.toLowerCase();

    gameDB = gameDB.replace(/[^a-zA-Z0-9]/g, '');

    //console.log(gameCounter);

    if (gameDB.includes(gameToSearch)) {

      embedResponse
        .setColor(8789534)
        .setTitle('Here is a list of all the games I could find that match your search')
        .setDescription('Enter and send the appID of the game you would like to add to your wishlist');

      embedResponse2
        .setColor(8789534)
        .setTitle('Continued...');

      embedResponse3
        .setColor(8789534)
        .setTitle('Continued...');

      
      if (1 <= gameCounter <= 25) {
        embedResponse.addFields({name: `Title ${gameCounter}`, value: `Name: **${steamList.apps[i].name}**\nAppID: __${steamList.apps[i].appid}__`, inline: true});

        gameCounter++;
      } else if (26 <= gameCounter <= 50) {
        embedResponse2.addFields({name: `Title ${gameCounter}`, value: `Name: **${steamList.apps[i].name}**\nAppID: __${steamList.apps[i].appid}__`, inline: true});

        gameCounter++;
      } else if (51 <= gameCounter <= 75) {
        embedResponse3.addFields({name: `Title ${gameCounter}`, value: `Name: **${steamList.apps[i].name}**\nAppID: __${steamList.apps[i].appid}__`, inline: true});

        gameCounter++;
      }

    }


  }

  gameCounter--;

 if (gameCounter <= 25) {
   message.channel.send(embedResponse);
 } else if (26 <= gameCounter <= 50) {
   message.channel.send(embedResponse);
   message.channel.send(embedResponse2);
 } else if (51 <= gameCounter) {
   message.channel.send(embedResponse);
   message.channel.send(embedResponse2);
   message.channel.send(embedResponse3);
 }

 console.log(embedResponse);
 console.log(embedResponse2);
 console.log(embedResponse3);

}

module.exports.help = {
  name: 'search'
}