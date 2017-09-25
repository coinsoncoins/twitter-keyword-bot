var expect    = require("chai").expect;
var Filterer = require("../app/filterer");

keywords = ["burn", "moon", "announcement", "buy"];
symbolsToIgnore = ["usd", "spy"];
usersToIgnore = ["stocknewsbot", "annoyingnewsfeed"];
textToIgnore = ["major shareholder", "public offering"];

const filterer = new Filterer(keywords, symbolsToIgnore, usersToIgnore, textToIgnore);

describe("Twitter Filterer", function() {
  it("has message for tweet with symbols", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: 'coinsoncoins', keyword: "buy"});
  });

  it("returns nothing for an invalid tweet", function() {
    tweet = { // no user
      id_str: '911960555145109504',
      text: 'You should buy $EDG'
    }
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("passes back the right keyword", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should burn $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj.keyword).to.equal("burn");
  });

  it("returns nothing for symbol in the symbolsToIgnore list", function() {
    tweet = {
      id_str: '911960555145109504',
      text: '$USD is strong',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'BTC', indices: [ 0, 4 ]}, { text: 'USD', indices: [ 0, 4 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.not.be.ok;
  });

  it("returns nothing for user in the usersToIgnore list", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: 'stocknewsbot'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.not.be.ok;
  });

});