#!/usr/bin/env node

var TwitterPackage = require('twitter');
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_TOKEN']);
var Filterer = require("./filterer");
var ListFileReader = require("./list-file-reader");
var MessageCreator = require('./message-creator');
var config = require('./config.json'); 

const util = require('util');

// console.log(fs.readFileSync('./app/config.json', 'utf8').toString())
// var config = JSON.parse(fs.readFileSync('./app/config.json', 'utf8').toString());

keywords = ListFileReader.readAsArray(config["keywordFile"]);
whitelistedSymbols = ListFileReader.readAsArray('./app/data/whitelisted-symbols.list');
whitelistedSymbols2 = ListFileReader.readAsArray('./app/data/whitelisted-symbols-addnl.list');
whitelistedSymbols = whitelistedSymbols.concat(whitelistedSymbols2);
officialAccounts = ListFileReader.readAsArray('./app/data/official-accounts.list')
symbolsToIgnore = ListFileReader.readAsArray('./app/data/symbols-to-ignore.list');
textToIgnore = ListFileReader.readAsArray('./app/data/text-to-ignore.list');
usersToIgnore = ListFileReader.readAsArray('./app/data/users-to-ignore.list');
const filterer = new Filterer(keywords, whitelistedSymbols, officialAccounts, symbolsToIgnore, usersToIgnore, textToIgnore);
console.log(officialAccounts)
function filterAndSendToTelegram(tweet) {
  obj = filterer.filter(tweet);
  if (!obj) { return; }

  message = MessageCreator.create(obj);
  
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
