var TwitterPackage = require('twitter');

_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.name)
}

const util = require('util');

function sendToTelegramBot(user, text) {
  console.log(user + " tweeted: " + text);
}

var secret = {
  consumer_key: process.env.TWITTER_KEYWORD_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_KEYWORD_BOT_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_SECRET
}
var client = new TwitterPackage(secret);


client.stream('user', {with: 'followings'},  function(stream) {

  stream.on('data', function(tweet) {
    //console.log(util.inspect(tweet, false, null))

    if (isTweet(tweet)) {
      user = tweet.user.name;
      text = tweet.text;
      sendToTelegramBot(user, text);
    }
  });

  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
});



