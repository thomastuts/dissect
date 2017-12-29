var cheerio = require('cheerio');
var jsdom = require("jsdom-no-contextify");

var metatags = [
  'description',
  'twitter:description',
  'og:description'
];

/**
 * Gets the summary based on social metatags that are found in most blogs for sharing purposes.
 *
 * @param rawHtml
 * @returns {string}
 */
function getSummaryFromMetatags(rawHtml) {
    if(!rawHtml){
        return '';
    }
  var $ = cheerio.load(rawHtml);

  for (var i = 0; i < metatags.length; i++) {
    var metatag = metatags[i];
    var metaName = $('meta[name="' + metatag + '"]').attr('content');
    var metaProperty = $('meta[property="' + metatag + '"]').attr('content');

    if (metaName || metaProperty) {
      return metaName || metaProperty;
    }
  }
}

/**
 * Gets the summary based on social metatags that are found in most blogs for sharing purposes.
 *
 * @param rawHtml
 * @returns {string}
 */
function getSummaryFromMetatagsAsync(rawHtml,cb) {
    if(!rawHtml){
        cb('');
    }

    jsdom.env(
        rawHtml,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var $ = window.$;
            for (var i = 0; i < metatags.length; i++) {
                var metatag = metatags[i];
                var metaName = $('meta[name="' + metatag + '"]').attr('content');
                var metaProperty = $('meta[property="' + metatag + '"]').attr('content');

                if (metaName || metaProperty) {
                    var summary =  metaName || metaProperty;
                    cb(summary);
                    break;
                }
            }
        }
    );


}

/**
 * Gets the summary by retrieving the article's content and returning the first interesting paragraph. Most definitely
 * not a silver bullet here, but at least it gets the job done in case there's no better option.
 *
 * @param rawHtml
 * @returns {string}
 */
function getSummaryFromContent(content) {
    if(!content){
        return '';
    }
  var $ = cheerio.load(content);

  var interestingParagraphs = $('p').filter(function () {
    return $(this).text().length > 25;
  });

  return $(interestingParagraphs).eq(0).text();
}

/**
 * Gets the summary by retrieving the article's content and returning the first interesting paragraph. Most definitely
 * not a silver bullet here, but at least it gets the job done in case there's no better option.
 *
 * @param rawHtml
 * @returns {string}
 */
function getSummaryFromContentAsync(content,cb) {
    if(!content){
        return '';
    }

    jsdom.env(
        content,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var $ = window.$;
            var interestingParagraphs = $('p').filter(function () {
                return $(this).text().length > 25;
            });
            cb($(interestingParagraphs).eq(0).text());
        }
    );
}

module.exports = {
  getSummary: function (rawHtml, content) {
    var summaryFromMetags = getSummaryFromMetatags(rawHtml);

    if (summaryFromMetags) {
      return summaryFromMetags;
    }
    else {
      if(!content){
        return '';
      }
      return getSummaryFromContent(content);
    }
  },
    getSummaryAsync: function (rawHtml, content,cb) {

        getSummaryFromMetatagsAsync(rawHtml,function(summaryFromMetags){
            if (summaryFromMetags) {
                cb(summaryFromMetags);
            }
            else {
                if(!content){
                    cb('');
                }
                getSummaryFromContentAsync(content,function(summary){
                  cb(summary);
                })
            }
        });


    }
};
