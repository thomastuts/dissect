/**
 * Remove newlines and other useless stuff
 * Remove all attributes on inline elements
 * Remove unwanted attributes (style, width, height, ...)
 * Remove content that is not related to the article ('Click to...')
 * Remove links in images
 * Remove header elements with the article's title in them
 *
 */

var prepForParsing = require('./prep-for-parsing');
var removeAttributes = require('./remove-attributes');
var removeAttributesAsync = require('./remove-attributes-async');
var cleanFormatting = require('./clean-formatting');
var cleanFormattingAsync = require('./clean-formatting-async');
var removeSocialElements = require('./remove-social-elements');
var removeSocialElementsAsync = require('./remove-social-elements-async');
var removeNavigationalElements = require('./remove-navigational-elements');
var removeNavigationalElementsAsync = require('./remove-navigational-elements-async');
var removeEmptyElements = require('./remove-empty-elements');
var removeEmptyElementsAsync = require('./remove-empty-elements-async');

module.exports = {
  prepForParsing: prepForParsing,
  cleanAfterParsing: function (rawHtml, host) {
    rawHtml = removeAttributes(rawHtml);
    rawHtml = removeSocialElements(rawHtml);
    rawHtml = removeNavigationalElements(rawHtml, host);
    rawHtml = removeEmptyElements(rawHtml);
    rawHtml = cleanFormatting(rawHtml);

    return rawHtml;
  },
  cleanAfterParsingAsync: function (rawHtml, host,cb) {
      removeAttributesAsync(rawHtml,function(rawHtml){
          removeSocialElementsAsync(rawHtml,function(rawHtml){
              removeNavigationalElementsAsync(rawHtml, host,function(rawHtml){
                  removeEmptyElementsAsync(rawHtml,function(rawHtml){
                      cleanFormattingAsync(rawHtml,function(rawHtml){
                          cb(rawHtml);
                      })
                  });
              })
          })
      });
  }
};
