var expect = require("chai").expect;
var MessageCreator = require("../app/message-creator");


describe("Message Creator", function() {
  it("creates message for symbols, keyword", function() {
    var obj = {symbols: ['EDG','DAR'], keyword: 'countdown', user: 'coinsoncoins', text: '$EDG $DAR countdown' }
    expect(MessageCreator.create(obj)).to.equal(
      "EDG,DAR[countdown]: @coinsoncoins: $EDG $DAR countdown");
  });

  it("creates message for quoted_keyword", function() {
    var obj = {symbols: ['EDG','DAR'], keyword: '', user: 'coinsoncoins', text: 'cool',
      quotedText: '$EDG $DAR countdown', quotedKeyword: 'countdown'}
    expect(MessageCreator.create(obj)).to.equal(
      "EDG,DAR[countdown-q]: @coinsoncoins: cool");
  });

  it("creates message for official accounts", function() {
    var obj = {symbols: [], keyword: 'countdown', user: 'bluecoin', text: 'burn coming soon', officialAccount: true }
    expect(MessageCreator.create(obj)).to.equal(
      "@@bluecoin[countdown]: @bluecoin: burn coming soon");
  });

  it("creates message for official accounts with symbols", function() {
    var obj = {symbols: ['BLUE'], keyword: 'countdown', user: 'bluecoin', text: 'burn coming soon $BLUE', officialAccount: true }
    expect(MessageCreator.create(obj)).to.equal(
      "@@bluecoin[countdown]: @bluecoin: burn coming soon $BLUE");
  });
});
