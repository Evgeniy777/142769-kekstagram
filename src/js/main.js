'use strict';
var resizer = require('./resizer');
var upload = require('./upload');
var renderPictures = require('./render-pictures');
resizer();
upload();
renderPictures();
