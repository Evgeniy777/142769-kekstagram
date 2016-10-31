'use strict';
module.exports = function() {
  (function() {
    var load = require('./load');
    var getPictureElement = require('./picture');
    var container = document.querySelector('.pictures.container');
    var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';

    var hideFilters = function() {
      document.querySelector('.filters').classList.add('hidden');
    };

    var showFilters = function() {
      document.querySelector('.filters').classList.remove('hidden');
    };

    var renderPictures = function(callback) {
      hideFilters();
      pictures.forEach(function(picture) {
        container.appendChild(getPictureElement(picture));
      });
      showFilters();

      if (typeof callback === 'function') {
        callback();
      }
    };

    load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
  })();
};