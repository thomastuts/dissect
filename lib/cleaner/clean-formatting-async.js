var jsdom = require("jsdom-no-contextify");
/**
 * Cleans up parsed HTML formatting by removing newlines.
 *
 * @param rawHtml
 * @returns {string}
 */
module.exports = function (rawHtml,cb) {
  rawHtml = rawHtml
    .replace(/\n/g, '')
    .trim();

    cb(rawHtml);
};
