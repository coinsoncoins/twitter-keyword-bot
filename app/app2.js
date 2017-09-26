#!/usr/bin/env node

var TwitterPackage = require('twitter');
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_TOKEN']);
var Filterer = require("./filterer");
var ListFileReader = require("./list-file-reader");

const util = require('util');

keywords = ListFileReader.readAsArray('./app/keywords.list');
whitelistedSymbols = ListFileReader.readAsArray('./app/whitelisted-symbols.list');
whitelistedSymbols2 = ListFileReader.readAsArray('./app/whitelisted-symbols-addnl.list');
whitelistedSymbols = whitelistedSymbols.concat(whitelistedSymbols2);
symbolsToIgnore = ListFileReader.readAsArray('./app/symbols-to-ignore.list');
textToIgnore = ListFileReader.readAsArray('./app/text-to-ignore.list');
usersToIgnore = ListFileReader.readAsArray('./app/users-to-ignore.list');
const filterer = new Filterer(keywords, whitelistedSymbols, symbolsToIgnore, usersToIgnore, textToIgnore);

function filterAndSendToTelegram(tweet) {
  obj = filterer.filter(tweet);
  if (!obj) { return; }

  var keyword = obj.keyword;
  if (!keyword) { keyword = obj.quotedKeyword + "-q"; }
  var message = `${obj.symbols}[${keyword}] :@${obj.user}: ${obj.text}\n-----------------`
  
  //var message = obj.symbols + "[" + obj.keyword + "] " + ": " + "@" + obj.user + ": " + obj.text + "\n--------------------"

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


client.stream('statuses/filter', {track: keywords.join(",")}, function(stream) {
  stream.on('data', function(tweet) {
    filterAndSendToTelegram(tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
    slimbot.sendMessage(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_CHAT_ID'], error);
  });
});
