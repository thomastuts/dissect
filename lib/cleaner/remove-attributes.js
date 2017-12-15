var cheerio = require('cheerio');
var _ = require('lodash');

var attributesToKeep = [
  'src',
  'href',
  'target'
];

/**
 * Removes all attributes from a given HTML string, except for the ones we're still interested in, such as img src,
 * anchor hrefs, ...
 *
 * @param rawHtml
 */
module.exports = function (rawHtml) {

  if(!rawHtml){
    return '';
  }

  var $ = cheerio.load(rawHtml);

  $('*').each(function () {
    var element = this;
    var attributes = _.chain(element.attribs)
      .keys()
      .difference(attributesToKeep)
      .value();

    attributes.forEach(function (attribute) {
      $(element).removeAttr(attribute);
    });
  });

  return $.html();
}
