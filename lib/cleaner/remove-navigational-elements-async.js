var cheerio = require('cheerio');
var _ = require('lodash');
var jsdom = require("jsdom-no-contextify");

/**
 * Removes all elements that are used for navigation (such as 'to top' links, article tags, ...)
 *
 * @param rawHtml
 */
module.exports = function (rawHtml, host,cb) {
    if(!rawHtml){
        cb('');
    }
    jsdom.env(
        rawHtml,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var $ = window.$;
            // Filter out 'back to top' links
            $('a').filter(function () {
                var hasTopInText = $(this).text().toLowerCase().indexOf('top') > -1;

                var hasHashInHref;
                if($(this).attr('href')){
                    hasHashInHref = $(this).attr('href').indexOf('#') > -1;
                }
                return hasTopInText && hasHashInHref;
            }).remove();

            // Filter out any links that have the `rel="tag"` attribute, or link back to the same host with 'tag' in the URL.
            $('a').each(function () {
                var relTag = $(this).attr('rel');
                var href = $(this).attr('href');

                if(!href){
                    return;
                }
                var isRelTag = relTag === 'tag';
                var isPartOfList = $(this).parents('ul').length > 0;
                var containsUrlWithTag = href.indexOf(host) > -1 && href.indexOf('tag') > -1;

                if (isRelTag || containsUrlWithTag) {
                    if (isPartOfList) {
                        $(this).parents('ul').remove();
                    }
                    else {
                        $(this).remove();
                    }
                }

                // Remove any other elements with a `tags` class.
                $('.tags').remove();
            });

            cb($.html());
        }
    );
}
