var request = require('request');
var url = require('url');
var cleaner = require('./lib/cleaner');
var author = require('./lib/parser/author');
var content = require('./lib/parser/content');
var title = require('./lib/parser/title');
var summary = require('./lib/parser/summary');
var keywords = require('./lib/parser/keywords');
var image = require('./lib/parser/image');

module.exports = {
  extractData: function (articleUrl, callback) {
    request(articleUrl, function (err, response, body) {
      var data = {};
      var preppedHtml = cleaner.prepForParsing(body);

      data.domain = url.parse(articleUrl).host;
      data.author = author.getAuthor(preppedHtml);
      data.title = title.getTitle(preppedHtml);
      data.content = content.getArticleContent(preppedHtml, data.host);
      data.summary = summary.getSummary(preppedHtml, data.content);
      data.keywords = keywords.getKeywords(preppedHtml);
      data.image = image.getImage(preppedHtml);

      callback(null, data);
    });
  }
}
