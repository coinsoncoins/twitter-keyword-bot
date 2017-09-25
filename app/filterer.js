
_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

class Filterer {
  constructor(keywords, symbolsToIgnore, usersToIgnore, textToIgnore) {
    if (_.isString(keywords)) { keywords = keywords.split(","); }
    this.keywords = keywords;
    this.symbolsToIgnore = symbolsToIgnore.map(function(n) { return n.toLowerCase(); });
    this.usersToIgnore = usersToIgnore;
    this.textToIgnore = textToIgnore;
  }

  filter(tweet) {
    if (! (isTweet(tweet))) { return; }
    if (! (tweet.entities && tweet.entities.symbols && tweet.entities.symbols.length > 0)) { return; }
    var retweeted = tweet.retweeted_status
    if (retweeted) { return; }
    var symbols = tweet.entities.symbols.map(function(x) { return x.text; });
    if (this.ignoreSymbol(symbols)) { return; }
    var user = tweet.user.screen_name;
    if (this.usersToIgnore.includes(user.toLowerCase())) { return; }
    var text = tweet.text;
    if (this.ignoreText(text)) { return; }
    
    var filteredInfo = {symbols: symbols, user: user, text: text, keyword: this.findKeyword(text)};
    return filteredInfo;
  }

  findKeyword(text) {
    var keyword = "";
    for (var k in this.keywords) {
      if (text.toLowerCase().includes(this.keywords[k])) {
        keyword = this.keywords[k];
        break;
      }
    }
    return keyword;
  }

  ignoreSymbol(symbols) {
    for (var k in symbols) {
      if (this.symbolsToIgnore.includes(symbols[k].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  ignoreText(text) {
    for (var k in textToIgnore) {
      if (text.toLowerCase().includes(textToIgnore[k])) {
        return true;
      }
    }
    return false;
  }

};

module.exports = Filterer;