var TwitterPackage = require('twitter');
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_TOKEN']);

_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

function sendToTelegram(tweet) {
  var user = tweet.user.screen_name;
  var text = tweet.text;
  var retweeted = tweet.retweeted_status
  var message = (retweeted ? "THIS IS A RETWEET" : "") + "@" + user + ": " + text

  console.log(message);
  //console.log(util.inspect(tweet, false, null))

  slimbot.sendMessage(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_CHAT_ID'], message);
}

var secret = {
  consumer_key: process.env.TWITTER_KEYWORD_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_KEYWORD_BOT_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_SECRET
}
var client = new TwitterPackage(secret);


client.stream('statuses/filter', {track: 'announcement,burn,countdown,atomic,major'}, function(stream) {
  stream.on('data', function(tweet) {
    if (isTweet(tweet)) {
      if (/\$[A-Za-z]{1,5}/.exec(tweet.text)) { // does it have a stock symbol in it i.e. $EDG
        sendToTelegram(tweet);
      }
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
