var cheerio = require('cheerio');

/**
 * Fetch <body> and <main> elements from DOM and, for each <img>, try to score its distance from 
 * parent body / main. Highest score is used to retrieve image. 
 * 
 * @param {object} body 
 */
function getImageCandidate(body) {
    var scoredImages = [];
    var main = body.find('main').eq(0);

    // fetching all other images from body and calculating distance to main or body section
    var imgs = body.find('img');
    imgs.each(index => {
        var img = cheerio(imgs.get(index));
        scoredImages.push({ score: 9 - img.parentsUntil(main || body).get().length, src: img.attr('src') })
    })

    // sorting
    scoredImages = scoredImages.sort((a, b) => a.score > b.score ? -1 : 1);
    return scoredImages[0].src;
}

/**
 * Tries to get the image from three sources: a scored rank based on how far the images are from <main> or <body> elements,
 * or uses contents from the `<meta class="swiftype" name="image">` tag.
 *
 * @param html
 * @returns {string}
 */
function getImage(html) {
    var $ = cheerio.load(html);

    var swifttypeImage = $('meta[class="swiftype"]').filter('[name="image"]').eq(0).attr('content');
    var imageCandidate = getImageCandidate($('body'));

    return imageCandidate || swifttypeImage;
}

module.exports = {
    getImage: getImage
};