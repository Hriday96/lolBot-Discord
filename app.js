// Require packages
const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv/config');

// Init bot
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Import config from dotenv
let prefix;
const owner = process.env.OWNER;
const token = process.env.TOKEN;

// Init database (firebase)
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

// Connect to db
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();

// Read command files
fs.readdir('./cmds', (err, files) => {
  if (err) {
    console.log(err);
  }

  let cmdFiles = files.filter(f => f.split('.').pop() === 'js');

  if (cmdFiles.length === 0) {
    console.log('No files found');
    return;
  }

  cmdFiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i+1}: ${f} loaded`);
    client.commands.set(props.help.name, props);
  })

})


// Ready notification in console
client.on('ready', async () => {
  console.log('Hello. I am ready!');
});

// Command handler
client.on('message', msg => {

  db.collection('guilds').doc(msg.guild.id).get().then((q) => {
    if (q.exists) {
      prefix = q.data().prefix;
    }
  }).then(() => {

    if(msg.channel.type === 'dm') return;
    if(msg.author.bot) return;
  
    let msg_array = msg.content.split(' ');
    let command = msg_array[0];
    let args = msg_array.slice(1);
  
    if(!command.startsWith(prefix)) return;
  
    if(client.commands.get(command.slice(prefix.length))) {
      let cmd = client.commands.get(command.slice(prefix.length));
      if (cmd) {
        cmd.run(client, msg, args, db);
      }
    }
  })
});


client.on('guildCreate', async gData => {
  db.collection('guilds').doc(gData.id).set({
    'guildID': gData.id,
    'guildName': gData.name,
    'guildOwner': gData.owner.user.username,
    'guildOwnerID': gData.owner.id,
    'guildMemberCount': gData.memberCount,
    'prefix': '!'
  });
});


// Bot Login
client.login(token);