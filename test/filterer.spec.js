var expect    = require("chai").expect;
var Filterer = require("../app/filterer");

keywords = "burn,moon,announcement,buy";
const filterer = new Filterer(keywords);

describe("Twitter Filterer", function() {
  it("has message for tweet with symbols", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: '@coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: '@coinsoncoins', keyword: "buy"});
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
        screen_name: '@coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj.keyword).to.equal("burn");
  });

});