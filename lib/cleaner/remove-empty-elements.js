var cheerio = require('cheerio');
var _ = require('lodash');

/**
 * Removes all empty elements.
 *
 * @param rawHtml
 */
module.exports = function (rawHtml) {
    if(!rawHtml){
        return '';
    }
  var $ = cheerio.load(rawHtml);

  $('*').each(function () {
    var children = $(this).children().length;
    var content = $(this).text().replace(/\t|\s/g, '');
    var isImage = $(this)[0].tagName === 'img';

    if (!children && !content && !isImage) {
      $(this).remove();
    }
  });

  return $.html();
}
