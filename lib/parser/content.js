var cheerio = require('cheerio');
var _ = require('lodash');
var cleaner = require('../cleaner');

/**
 * Gets a likely candidate for the article's content based on a DOM's element 'article score' (based on Readability's
 * implementation at https://code.google.com/p/arc90labs-readability/source/browse/branches/haiti/js/readability.js).
 * This algorithm assumes that the article is written in `<p>` tags. If it's not, it will return `undefined`.
 *
 * TODO: add additional score parameters based on paragraph length, comma occurrences and so on (see Readability above)
 *
 * @param rawHtml
 * @returns {*}
 */
function getLikelyCandidate(rawHtml) {
  var $ = cheerio.load(rawHtml);
  var $body = $('body');
  var candidates = [];

  $body.find('p').each(function () {
    var paragraph = $(this);
    var parentNode = $(this).get(0).parentNode;

    if (!parentNode.extracted) {
      parentNode.extracted = {
        score: 0
      };
      candidates.push(parentNode);
    }

    var paragraphLength = paragraph.text().length;
    parentNode.extracted.score += paragraphLength;
  });

  if (candidates.length > 0) {
    var sortedByScore = _.sortBy(candidates, function (candidate) {
      return candidate.extracted.score;
    }).reverse();

    return $(sortedByScore[0]).html();
  }
}

/**
 * Loops over every node in the DOM and checks for its own text length. We try to pick the one with the longest length
 * in the hopes that this will actually be content. This is merely used as a fallback and probably doesn't work half the
 * time. This should probably be revisited some time in the future.
 *
 * This implementation was mostly tested on Paul Graham's essays, so I'm not sure if this would work reliably anywhere
 * else. Let's hope people actually use paragraph elements to write an article so we don't even need to use this
 * janky thing.
 *
 * @param rawHtml
 * @returns {string}
 */
function getContentByLongestLength(rawHtml) {
  console.log('Getting longest length');
  var longestTextLength = 0;
  var $longest = null;
  var $ = cheerio.load(rawHtml);

  $('*').each(function () {
    var textLength = $(this).clone().children().remove().end().text().length;
    if (textLength > longestTextLength) {
      $longest = $(this);
      longestTextLength = textLength;
    }
  });

  if(!$longest){
    return '';
  }

  var content = $longest.html();

  // Replace any existing newlines with a space
  content = content.replace(/\r?\n|\r/g, ' ');

  // Replace any multiple breaks with newlines
  content = content.replace(/(<br\s?\/?>)\1+/g, '\n');

  // Replace any single breaks with newlines
  content = content.replace(/(<br\s?\/?>)/g, '\n');

  // Replace all paragraphs divided by newlines with actual paragraphs
  var paragraphs = content.split('\n');

  var contentInParagraphs = paragraphs.map(function (paragraph) {
    return '<p>' + paragraph + '</p>';
  }).join('');

  return contentInParagraphs;
}

function getArticleContent(rawHtml, host) {
  var content = getLikelyCandidate(rawHtml) || getContentByLongestLength(rawHtml);
  content = cleaner.cleanAfterParsing(content, host);
  return content;
}

module.exports = {
  getArticleContent: getArticleContent
};
