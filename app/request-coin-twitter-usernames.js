

var TwitterPackage = require('twitter');
var fs = require('fs');

var secret = {
  consumer_key: process.env.TWITTER_KEYWORD_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_KEYWORD_BOT_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_SECRET
}
var client = new TwitterPackage(secret);


promises = [];
promises[0] = client.get('lists/members', {slug: 'coins', owner_screen_name: 'coinsoncoins', count: 5000})
promises[1] = client.get('lists/members', {slug: 'coins-5-50', owner_screen_name: 'coinsoncoins', count: 5000})
promises[2] = client.get('lists/members', {slug: 'coins-50-200', owner_screen_name: 'coinsoncoins', count: 5000})
promises[3] = client.get('lists/members', {slug: 'coins-1-10', owner_screen_name: 'coinsoncoins', count: 5000})

Promise.all(promises)
.then(values => {
  set = new Set()
  for(var i=0; i<values.length; i++) {
    names = values[i].users.map(function(u) { return u.screen_name; });

    fs.writeFileSync(__dirname + `/data/tmp/official-accounts${i}.list`, names.join("\n"));

    names.forEach(function(e) {
      set.add(e);
    });
  }
  screen_names = Array.from(set);
  screen_names.push('AltcoinArcade'); // test account
  fs.writeFileSync(__dirname + '/data/official-accounts.list', screen_names.join("\n"));
})
.catch(err => {
    console.log(reason);
});

