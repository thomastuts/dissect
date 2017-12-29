var jsdom = require("jsdom-no-contextify");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + '/../jquery.js', "utf-8");
/**
 * Cleans up parsed HTML formatting by removing newlines.
 *
 * @param rawHtml
 * @returns {string}
 */
module.exports = function (rawHtml,cb) {
  setTimeout(function(){
      rawHtml = rawHtml
          .replace(/\n/g, '')
          .trim();

      cb(rawHtml);
  });
};
