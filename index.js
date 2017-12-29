var request = require('request');
var url = require('url');
var cleaner = require('./lib/cleaner');
var author = require('./lib/parser/author');
var content = require('./lib/parser/content');
var title = require('./lib/parser/title');
var summary = require('./lib/parser/summary');

module.exports = {
    extractData: function (articleUrl, callback) {
        request(articleUrl, function (err, response, body) {

            var preppedHtml = cleaner.prepForParsing(body);
            var data = {
                body:preppedHtml,
                article: {}
            };

            data.article.domain = url.parse(articleUrl).host;
            data.article.author = author.getAuthor(preppedHtml);
            data.article.title = title.getTitle(preppedHtml);
            data.article.content = content.getArticleContent(preppedHtml, data.host);
            data.article.summary = summary.getSummary(preppedHtml, data.content);
            callback(null, data);

        });
    }
}
