#!/usr/bin/env node

var TwitterPackage = require('twitter');
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_TOKEN']);
var Filterer = require("./filterer");

const util = require('util');

var keywords = 'major,announce,announces,announcement,announcements,burn,burns,burned,burnt,countdown,count down,atomic,launch,rebrand,rebranding,sold out,leak,leaked,buy wall,buywall,days left,days until,moon,moons';

const filterer = new Filterer(keywords);

function filterAndSendToTelegram(tweet) {
  obj = filterer.filter(tweet);
  if (!obj) { return; }
  
  var message = obj.symbols + "[" + obj.keyword + "] " + ": " + "@" + obj.user + ": " + obj.text + "\n--------------------"

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


client.stream('statuses/filter', {track: keywords}, function(stream) {
  stream.on('data', function(tweet) {
    filterAndSendToTelegram(tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
