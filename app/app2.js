#!/usr/bin/env node

var TwitterPackage = require('twitter');
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_TOKEN']);

_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

function filterAndSendToTelegram(tweet) {
  if (! (isTweet(tweet))) { return; }
  if (! (tweet.entities && tweet.entities.symbols && tweet.entities.symbols.length > 0)) { return; }
  var retweeted = tweet.retweeted_status
  if (retweeted) { return; }
  var symbols = tweet.entities.symbols.map(function(x) { return x.text; });
  var user = tweet.user.screen_name;
  var text = tweet.text;
  
  var message = symbols + ": " + "@" + user + ": " + text + "\n--------------------"

  console.log(message);
  console.log(util.inspect(tweet, false, null))

  slimbot.sendMessage(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_CHAT_ID'], message);
}

var secret = {
  consumer_key: process.env.TWITTER_KEYWORD_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_KEYWORD_BOT_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_SECRET
}
var client = new TwitterPackage(secret);


client.stream('statuses/filter', {track: 'announcement,announcements,burn,burns,burned,countdown,atomic,major'}, function(stream) {
  stream.on('data', function(tweet) {
    filterAndSendToTelegram(tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
