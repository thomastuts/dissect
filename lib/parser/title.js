var cheerio = require('cheerio');

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
function getTitleFromMetaTags(rawHtml) {
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

  if (siteName && title) {
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
  var $ = cheerio.load(rawHtml);
  var title = $('title').text();
  var siteName = getSiteName(rawHtml);

  if (siteName) {
    title = removeSiteNameFromTitle(title, siteName);
  }

  return title;
}

module.exports = {
  getTitle: function (rawHtml) {
    return getTitleFromMetaTags(rawHtml) || getTitleFromWindowTitle(rawHtml);
  }
};
