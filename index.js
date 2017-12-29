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

            if(data.article.domain === 'www.perfil.com'){
                author.getAuthorAsync(preppedHtml,function(author){
                    data.article.author = author;

                    content.getArticleContentForItemprop(preppedHtml,data.host,function(cleanContent){
                        data.article.content = cleanContent;

                        title.getTitleAsync(preppedHtml,function (title) {
                            data.article.title = title;
                            data.article.summary = summary.getSummary(preppedHtml, data.content);

                            callback(null, data);
                        });
                    });
                });

            }else{
                data.article.content = content.getArticleContent(preppedHtml, data.host);
                callback(null, data);
            }
        });
    }
}
