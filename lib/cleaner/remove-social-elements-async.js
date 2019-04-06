var cheerio = require('cheerio');
var _ = require('lodash');
var jsdom = require("jsdom-no-contextify");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + '/../jquery.js', "utf-8");

var shareUrls = [
  'twitter.com/intent',
  'facebook.com/sharer'
];

/**
 * Removes all elements that contain any social keywords.
 *
 * @param rawHtml
 */
module.exports = function (rawHtml,cb) {
    if(!rawHtml){
        cb('');
    }

    jsdom.env({
        html: rawHtml,
        src: [jquery],
        done: function (errors, window) {
            var $ = require("jquery")(window);
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

            cb($.html());
        }
    });
}
