var cheerio = require('cheerio');
var _ = require('lodash');

/**
 * Removes all post elements that include author, the post's date, ...
 *
 * @param rawHtml
 */
module.exports = function (rawHtml, host) {
    if(!rawHtml){
        return '';
    }
  var $ = cheerio.load(rawHtml);

  $('*[property="author"]').remove();
  $('*[rel="author"]').remove();
  $('datetime').remove();
  $('.date').remove();

  return $.html();
}
