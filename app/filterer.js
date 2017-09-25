
_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

exports.filter = function(tweet) {
  if (! (isTweet(tweet))) { return; }
  if (! (tweet.entities && tweet.entities.symbols && tweet.entities.symbols.length > 0)) { return; }
  var retweeted = tweet.retweeted_status
  if (retweeted) { return; }
  var symbols = tweet.entities.symbols.map(function(x) { return x.text; });
  var user = tweet.user.screen_name;
  var text = tweet.text;
  
  filteredInfo = {symbols: symbols, user: user, text: text};
  return filteredInfo;

  //console.log(message);
  //console.log(util.inspect(tweet, false, null))

  //slimbot.sendMessage(process.env['TWITTER_KEYWORD_BOT_TELEGRAM_CHAT_ID'], message);
}

exports.prepareMessage = function(obj, keywords) {
  var keyword = "";
  for (var k in keywords) {
    if (obj.text.toLowerCase().includes(keywords[k])) {
      keyword = keywords[k];
      break
    }
  }
  obj.keyword = keyword;
  return obj;
}