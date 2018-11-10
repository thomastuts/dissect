var cheerio = require('cheerio');

/**
 * Tries to get the image from three sources: the `<meta name="author">` tag, any anchors with the `rel="author"`
 * attribute or, as a last resort, the text value from a DOM element with an `author` class.
 *
 * @param html
 * @returns {string}
 */
function getKeywords(html) {
    var $ = cheerio.load(html);
  
    var swifttypeTags = $('meta[class="swiftype"]').filter('[name="tags"]').get().map(tag => $(tag).attr('content')).join();
    var metatagKeywords = $('meta[name="keywords"]').eq(0).attr('content');
    return swifttypeTags || metatagKeywords;
  }
  
  module.exports = {
    getKeywords: getKeywords
  };