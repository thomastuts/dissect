var cheerio = require('cheerio');
var jsdom = require("jsdom-no-contextify");

/**
 * Tries to get the author from three sources: the `<meta name="author">` tag, any anchors with the `rel="author"`
 * attribute or, as a last resort, the text value from a DOM element with an `author` class.
 *
 * @param html
 * @returns {string}
 */
function getAuthor(html) {
    if(!html){
        return '';
    }
    var $ = cheerio.load(html);

    var metatagAuthor = $('meta[name="author"]').attr('content');
    var semanticAuthor = $('*[rel="author"]').eq(0).text();
    var classAuthor = $('.author').eq(0).text();
    var classAuthorSpanish = $('.columnista a').eq(0).text();
    var itemPropAuthorSpanish = $('a[itemprop="author"]').text();
    var dataAuthorProperty = $('.article-view').attr('data-author');

    return metatagAuthor || semanticAuthor || classAuthor || classAuthorSpanish || itemPropAuthorSpanish || dataAuthorProperty;
}

/**
 * Tries to get the author from three sources: the `<meta name="author">` tag, any anchors with the `rel="author"`
 * attribute or, as a last resort, the text value from a DOM element with an `author` class.
 *
 * @param html
 * @returns {string}
 */
function getAuthorAsync(html,cb) {
    if(!html){
        cb('');
    }

    jsdom.env(
        html,
        __dirname + '/lib',
        ["jquery.js"],
        function (errors, window) {
            var $ = window.$;
            var metatagAuthor = $('meta[name="author"]').attr('content');
            var semanticAuthor = $('*[rel="author"]').eq(0).text();
            var classAuthor = $('.author').eq(0).text();
            var classAuthorSpanish = $('.columnista a').eq(0).text();
            var itemPropAuthorSpanish = $('a[itemprop="author"]').text();
            var dataAuthorProperty = $('.article-view').attr('data-author');
            var author = metatagAuthor || semanticAuthor || classAuthor || classAuthorSpanish || itemPropAuthorSpanish || dataAuthorProperty;
            cb(author)
        }
    );
}

module.exports = {
    getAuthor: getAuthor,
    getAuthorAsync: getAuthorAsync
};
