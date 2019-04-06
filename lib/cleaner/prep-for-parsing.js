var cheerio = require('cheerio');

var elementsToRemove = [
  'script',
  'header',
  'footer'
];

var blacklistRegex = /ads|social|comment/i;

/**
 * Prepares a raw HTML string by removing any unnecessary items, like scripts, headers and footers. Also tries to remove
 * any elements that are most likely uninteresting (comments, ads, social stuff, ...).
 *
 * @param rawHtml
 */
module.exports = function (rawHtml) {

  if(!rawHtml){
    return '';
  }

  var $ = cheerio.load(rawHtml);

  var $body = $('body');

  elementsToRemove.forEach(function (elementToRemove) {
    $body.find(elementToRemove).remove();
  });

  $body.find('*').filter(function () {
    var idAndClasses = $(this).attr('id') + $(this).attr('class');
    if (idAndClasses) {
      return idAndClasses.match(blacklistRegex);
    }
    else {
      return false;
    }
  }).remove();

  return $.html();
}
