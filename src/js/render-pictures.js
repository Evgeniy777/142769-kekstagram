'use strict';
module.exports = function() {
  var gallery = require('./gallery');
  var load = require('./load');
  var Picture = require('./picture');
  var container = document.querySelector('.pictures.container');
  var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';

  var hideFilters = function() {
    document.querySelector('.filters').classList.add('hidden');
  };

  var showFilters = function() {
    document.querySelector('.filters').classList.remove('hidden');
  };
  var renderPictures = function(pictures) {
    hideFilters();
    pictures.forEach(function(picture, num) {
      container.appendChild(new Picture(picture, num).element);
    });
    gallery.setPictures(pictures);
    showFilters();
  };

  load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
};
