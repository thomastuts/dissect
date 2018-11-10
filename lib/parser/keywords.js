var cheerio = require('cheerio');

/**
 * Tries to get the keywords from two sources: the `<meta name="keywords">` tag,
 * or from <meta class="swiftype" name="tags"> tag.
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