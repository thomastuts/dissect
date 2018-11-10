# article-extractor

> A Node.js module to retrieve article content and metadata from a URL.

**This module is under heavy development! Its quality and API will probably change a lot, so keep an eye out for any changes.**

To see what features are coming up next, or if you'd like to suggest one yourself, go here: https://github.com/thomastuts/article-extractor/issues/3

## Demo
You can see `article-extractor` in action here:
```
GET http://article-extractor.thomastuts.com/parse?url=AN_ARTICLE_URL
```


## Installation
`npm install --save article-extractor`

## Extracting data
```js
var extractor = require('article-extractor');

extractor.extractData('http://paulgraham.com/altair.html', function (err, data) {
  console.log(data);
});

```

## Extract result
The result looks like this:
```json
{
    "domain": "thomastuts.com",
    "author": "Thomas Tuts",
    "title": "Article Extractor Demo",
    "summary": "A Node.js module to retrieve article content and metadata from a URL.",
    "content": "<p>This is the article content.</p>",
    "keywords": "article,extractor,demo,node,module,metadata",
    "image": "http://ep.yimg.com/ca/I/paulgraham_2271_3232"
}
```

## Change log

#1.1.0
* Corrected a logic related to parse and extract information abou href presence in `<a>` elements and it's '#' href marker
* Improved structure with keywords based on meta tags `<meta name="keywords">` and `<meta class="siwftype" name="tags">`
* Improved structure with image based on scored rank (`how far images are related to <main> or <body> element`) or `<meta class="siwftype" name="image">`
* Added a option to use `<meta class="siwftype" name="blogger_name">` as a source for author name
