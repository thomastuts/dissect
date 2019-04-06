var cheerio = require('cheerio');
var _ = require('lodash');
var jsdom = require("jsdom-no-contextify");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + '/../jquery.js', "utf-8");

/**
 * Removes all empty elements.
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
                var children = $(this).children().length;
                var content = $(this).text().replace(/\t|\s/g, '');
                var isImage = $(this)[0].tagName === 'img';

                if (!children && !content && !isImage) {
                    $(this).remove();
                }
            });

            cb($.html());
        }
    });

}
