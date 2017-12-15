var cheerio = require('cheerio');
var _ = require('lodash');

var shareUrls = [
  'twitter.com/intent',
  'facebook.com/sharer'
];

/**
 * Removes all elements that contain any social keywords.
 *
 * @param rawHtml
 */
module.exports = function (rawHtml) {
    if(!rawHtml){
        return '';
    }
  var $ = cheerio.load(rawHtml);

  $('*').each(function () {
    var text = $(this).text().toLowerCase();
    var possibleSocialElement = text.indexOf('share on') > -1;

    if (possibleSocialElement) {
      var anchors = $(this).find('a');
      anchors.each(function () {
        var $anchor = $(this);
        var href = $anchor.attr('href');

        _.each(shareUrls, function (shareUrl) {
          if (href.indexOf(shareUrl) > -1) {
            $anchor.remove();
          }
        });
      });
    }
  });

  return $.html();
}
