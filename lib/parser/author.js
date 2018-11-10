var cheerio = require('cheerio');

/**
 * Tries to get the author from three sources: the `<meta name="author">` tag, any anchors with the `rel="author"`
 * attribute or, as a last resort, the text value from a DOM element with an `author` class.
 *
 * @param html
 * @returns {string}
 */
function getAuthor(html) {
  var $ = cheerio.load(html);

  var swifttypeAuthor = $('meta[class="swiftype"]').filter('[name="blogger_name"]').eq(0).attr('content');
  var metatagAuthor = $('meta[name="author"]').attr('content');
  var semanticAuthor = $('*[rel="author"]').eq(0).text();
  var classAuthor = $('.author').eq(0).text();
  return swifttypeAuthor || metatagAuthor || semanticAuthor || classAuthor;
}

module.exports = {
  getAuthor: getAuthor
};
