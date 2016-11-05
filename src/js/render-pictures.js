'use strict';
module.exports = function() {
  var load = require('./load');
  var gallery = require('./gallery');
  var getPictureElement = require('./get-picture-element');
  var container = document.querySelector('.pictures.container');
  var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';

  var hideFilters = function() {
    document.querySelector('.filters').classList.add('hidden');
  };

  var showFilters = function() {
    document.querySelector('.filters').classList.remove('hidden');
  };
  
  var renderPictures = function(pictures) {
    pictures.forEach(function(picture, num) {
      container.appendChild(getPictureElement(picture, num));
    });
    gallery.setPictures(pictures);
    showFilters();
  };

  load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
};
