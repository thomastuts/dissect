var cheerio = require('cheerio');
var jsdom = require("jsdom-no-contextify");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + '/../jquery.js', "utf-8");

var titleMetatags = [
    'og:title',
    'twitter:title'
];

var sitenameMetatags = [
    'og:site_name',
    'twitter:domain'
];

/**
 * Removes the site's name from the article title, and keeps removing the last character in the title until it hits
 * an alphabetic character. This is done to remove any delimiters that are usually used to add the site's name to the
 * article title (for example: This Is An Article | WIRED).
 *
 * @param articleTitle
 * @param siteName
 * @returns {string}
 */
function removeSiteNameFromTitle(articleTitle, siteName) {

    if(!articleTitle){
        return '';
    }

    if(articleTitle === siteName){
        return '';
    }

    articleTitle = articleTitle.replace(siteName, '');
    var lastChar = articleTitle.charAt(articleTitle.length - 1);

    while (!/[a-zA-Z|?|!|.]/.test(lastChar)) {
        articleTitle = articleTitle.substring(0, articleTitle.length - 1);
        lastChar = articleTitle.charAt(articleTitle.length - 1);
    }

    return articleTitle;
}

/**
 * Gets the site name based on metatags.
 *
 * @param rawHtml
 * @returns {string}
 */
function getSiteName(rawHtml) {
    if(!rawHtml){
        return '';
    }
    var $ = cheerio.load(rawHtml);

    for (var i = 0; i < sitenameMetatags.length; i++) {
        var metatag = sitenameMetatags[i];
        var sitename = $('meta[property="' + metatag + '"]').attr('content');

        if (sitename) {
            return sitename;
        }
    }
}

/**
 * Gets the article's title from metatags used for social sharing.
 *
 * @param rawHtml
 * @returns {string}
 */
function getTitleFromMetaTagsAsync(rawHtml,cb) {
    if(!rawHtml){
        cb('');
    }

    jsdom.env({
        html: rawHtml,
        src: [jquery],
        done: function (errors, window) {
            var $ = require("jquery")(window);
            var title;
            var siteName = getSiteName(rawHtml);

            for (var i = 0; i < titleMetatags.length; i++) {
                var metatag = titleMetatags[i];
                title = $('meta[property="' + metatag + '"]').attr('content');

                if (title) {
                    break;
                }
            }

            if (siteName) {
                title = removeSiteNameFromTitle(title, siteName);
            }
            cb(title);
        }
    });
}

/**
 * Gets the article's title from metatags used for social sharing.
 *
 * @param rawHtml
 * @returns {string}
 */
function getTitleFromMetaTags(rawHtml) {
    if(!rawHtml){
        return '';
    }
    var $ = cheerio.load(rawHtml);
    var title;
    var siteName = getSiteName(rawHtml);

    for (var i = 0; i < titleMetatags.length; i++) {
        var metatag = titleMetatags[i];
        title = $('meta[property="' + metatag + '"]').attr('content');

        if (title) {
            break;
        }
    }

    if (siteName) {
        title = removeSiteNameFromTitle(title, siteName);
    }

    return title;
}

/**
 * Gets the article name from the window's title.
 *
 * @param rawHtml
 * @returns {string}
 */
function getTitleFromWindowTitle(rawHtml) {
    if(!rawHtml){
        return '';
    }
    var $ = cheerio.load(rawHtml);
    var title = $('title').text();
    var siteName = getSiteName(rawHtml);

    if (siteName) {
        title = removeSiteNameFromTitle(title, siteName);
    }

    return title;
}

/**
 * Gets the article name from the window's title.
 *
 * @param rawHtml
 * @returns {string}
 */
function getTitleFromWindowTitleAsync(rawHtml,cb) {
    if(!rawHtml){
        return '';
    }

    jsdom.env({
        html: rawHtml,
        src: [jquery],
        done: function (errors, window) {
            var $ = require("jquery")(window);
            var title = $('title').text();
            var siteName = getSiteName(rawHtml);

            if (siteName) {
                title = removeSiteNameFromTitle(title, siteName);
            }

            cb(title);
        }
    });

}

module.exports = {
    getTitle: function (rawHtml) {
        return getTitleFromMetaTags(rawHtml) || getTitleFromWindowTitle(rawHtml);
    },
    getTitleAsync: function (rawHtml,cb) {
        getTitleFromMetaTagsAsync(rawHtml,function(title){
          if(!title){
              getTitleFromWindowTitleAsync(rawHtml,function(title){
                cb(title);
              });
              return;
          }
            cb(title);
        });
    }
};
