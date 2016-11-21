'use strict';

var getPictureElement = require('./get-picture-element');
var gallery = require('./gallery');
var Picture = function(data, num) {
  this.data = data;
  this.pictureNumber = num;
  this.element = getPictureElement(data, num);
  this.onPictureClick = this.onPictureClick.bind(this);
  this.element.addEventListener('click', this.onPictureClick);
};
Picture.prototype.onPictureClick = function(event, num) {
  event.preventDefault();
  if(!event.target.classList.contains('picture-load-failure')) {
    gallery.show(this.pictureNumber);
  }
};
Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPictureClick);
};
module.exports = Picture;
