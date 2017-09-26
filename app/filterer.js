
_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

class Filterer {
  constructor(keywords, whitelistedSymbols, officialAccounts, symbolsToIgnore, usersToIgnore, textToIgnore) {
    if (_.isString(keywords)) { keywords = keywords.split(","); }
    this.keywords = keywords;
    this.whitelistedSymbols = whitelistedSymbols.map(function(n) { return n.toUpperCase(); });
    this.officialAccounts = officialAccounts;
    this.symbolsToIgnore = symbolsToIgnore.map(function(n) { return n.toUpperCase(); });
    this.usersToIgnore = usersToIgnore;
    this.textToIgnore = textToIgnore;
  }

  filter(tweet) {
    if (! (isTweet(tweet))) { return; }
    if (tweet.retweeted_status) { return; } // dont process retweets
    var user = tweet.user.screen_name;
    var text = tweet.text;
    var symbols = []
    if (tweet.entities && tweet.entities.symbols && tweet.entities.symbols.length > 0) {
      symbols = tweet.entities.symbols.map(function(x) { return x.text.toUpperCase(); });
    }

    var bFromOfficialAccount = this.isFromOfficialAccount(user);
    var bSymbolsAreWhitelisted = this.areSymbolsWhitelisted(symbols);
    if (!bFromOfficialAccount && !bSymbolsAreWhitelisted) { return; }

    if (this.ignoreSymbol(symbols)) { return; }
    if (this.usersToIgnore.includes(user.toLowerCase())) { return; }
    if (this.ignoreText(text)) { return; }
    
    var filteredInfo = {symbols: symbols, user: user, text: text, 
      keyword: this.findKeyword(text), officialAccount: bFromOfficialAccount};

    if (tweet.quoted_status && tweet.quoted_status.text) {
      filteredInfo.quotedText = tweet.quoted_status.text;
      filteredInfo.quotedKeyword = this.findKeyword(filteredInfo.quotedText);
    }

    return filteredInfo;
  }

  areSymbolsWhitelisted(symbols) {
    for (var k in symbols) {
      if (this.whitelistedSymbols.includes(symbols[k])) {
        return true;
      }
    }
    return false;
  }

  isFromOfficialAccount(user) {
    return this.officialAccounts.includes(user);
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
      console.log
      if (this.symbolsToIgnore.includes(symbols[k].toUpperCase())) {
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