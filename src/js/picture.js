'use strict';

var getPictureElement = require('./get-picture-element');
var gallery = require('./gallery');
var Picture = function(data, num) {
  this.data = data;
  this.element = getPictureElement(data, num);
  this.element.onclick = function(event) {
    event.preventDefault();
    if(!event.target.classList.contains('picture-load-failure')) {
      gallery.show(num);
    }
  };
  this.remove = function() {
    this.element.onclick = null;
  };
};

module.exports = Picture;
