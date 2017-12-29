var cheerio = require('cheerio');
var _ = require('lodash');
var jsdom = require("jsdom-no-contextify");

/**
 * Removes all empty elements.
 *
 * @param rawHtml
 */
module.exports = function (rawHtml,cb) {
    if(!rawHtml){
        cb('');
    }

    jsdom.env(
        rawHtml,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var $ = window.$;
            $('*').each(function () {
                var children = $(this).children().length;
                var content = $(this).text().replace(/\t|\s/g, '');
                var isImage = $(this)[0].tagName === 'img';

                if (!children && !content && !isImage) {
                    $(this).remove();
                }
            });

            cb($.html());
        }
    );

}
