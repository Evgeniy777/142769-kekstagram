'use strict';
var resizer = require('./resizer');
var upload = require('./upload');
var gallery = require('./gallery');
var renderPictures = require('./render-pictures');
resizer();
upload();
renderPictures();
