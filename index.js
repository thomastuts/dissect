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
                console.log("Get Perfil",data.article.domain);
                author.getAuthorAsync(preppedHtml,function(author){
                    data.article.author = author;

                    content.getArticleContentForItemprop(preppedHtml,data.host,function(cleanContent){
                        data.article.content = cleanContent;

                        title.getTitleAsync(preppedHtml,function (title) {
                            data.article.title = title;
                            summary.getSummaryAsync(preppedHtml, data.content,function(summary){
                                data.article.summary = summary;
                                callback(null, data);
                            });
                        });
                    });
                });

            }else{
                console.log("Get Perfil",data.article.domain);

                data.article.author = author.getAuthor(preppedHtml);
                data.article.title = title.getTitle(preppedHtml);
                data.article.content = content.getArticleContent(preppedHtml, data.host);
                data.article.summary = summary.getSummary(preppedHtml, data.content);
                callback(null, data);
            }
        });
    }
}
