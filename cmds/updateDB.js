const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv/config');

const owner = process.env.OWNER;

module.exports.run = async (client, message, args, db) => {

  if (args.length === 0) {
    if(message.author.id === owner){

      message.channel.send('Authorized Access')

      async function getSteamAppList() {
        let response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        let data = await response.json();

        const jsonString = JSON.stringify(data.applist);

        fs.writeFile('./steamAppList.json', jsonString, err => {
          if (err) {
            console.log('Error writing file', err)
          } else {
            console.log('Successful write to file')
            message.channel.send(`A total of ${data.applist.apps.length} entries were updated!`)
          }
        })

      }

      getSteamAppList();

    } else {
      message.channel.send('Unauthorized Command')
    }
    
  } else {
    message.channel.send('This command does not require an argument');
  }

}

module.exports.help = {
  name: 'updateDB'
}