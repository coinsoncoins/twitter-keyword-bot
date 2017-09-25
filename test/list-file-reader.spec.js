var expect    = require("chai").expect;
var ListFileReader = require("../app/list-file-reader");


describe("List File Reader", function() {
  it("returns an array of the list file contents", function() {
    keywords = ListFileReader.readAsArray('./test/keywords.list');
    expect(keywords).to.deep.equal(['buy', 'burn', 'announcement']);
  });

});