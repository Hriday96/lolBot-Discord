const fs = require('fs');
const steamList = require('../steamAppList.json');

module.exports.run = async (client, message, args, db) => {
  
  const game = (String(args)).replace(/[^a-zA-Z]/g, "");

  let searchedGame;

  for (let i = 0; i < steamList.apps.length; i++) {
    searchedGame = (steamList.apps[i].name).toLowerCase().replace(/[^a-zA-Z]/g, "");
    
    if (searchedGame.includes(game)) {
      //console.log(`SearchTerm: ${game}  DB: ${searchedGame}`)
      //console.log(steamList.apps[i]);
      if (searchedGame === game) {
        //console.log(steamList.apps[i]);

        let gameObject = steamList.apps[i];

        let dbWishlist = [];

        db.collection('users').doc(message.author.id).get().then((q) => {
          dbWishlist = q.data().wishlist;
          // console.log(q.data());
          // console.log(dbWishlist)
        }).then(() => {

          dbWishlist.push(gameObject);

          db.collection('users').doc(message.author.id).update({
            'wishlist': dbWishlist

        })

        

        })
      }

    }

  }

  db.collection('users').doc(message.author.id).get().then((q) => {
    //console.log(q.data());

    if (q.data() === undefined) {
      db.collection('users').doc(message.author.id).set({
        'userID': message.author.id,
        'wishlist': []
      })
    }

  })

}

module.exports.help = {
  name: 'add'
}