module.exports.run = async (client, message, args, db) => {

  message.channel.send('This is a test message!');

}

module.exports.help = {
  name: 'test'
}