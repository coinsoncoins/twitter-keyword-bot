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

function filterTweetForKeywords(user, text) {
  if (! (_.includes(text, 'burn') || _.includes(text, 'countdown') 
    || _.includes(text, 'announcement') || _.includes(text, 'atomic'))) { return; }

  message = "@" + user + ": " + text
  console.log(message);
  slimbot.sendMessage(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_CHAT_ID'], message);
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
      user = tweet.user.screen_name;
      text = tweet.text;
      filterTweetForKeywords(user, text);
    }
  });

  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
});



