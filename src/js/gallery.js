'use strict';

var BaseComponent = require('./base-component');
var inherit = require('./utils');
var Gallery = function() {
  BaseComponent.call(this);
  this.pictures = [];
  this.activePicture = 0;
  this.gallery = document.querySelector('.gallery-overlay');
  this.galleryClose = document.querySelector('.gallery-overlay-close');
  this.galleryImage = document.querySelector('.gallery-overlay-image');
  this.showNext = this.showNext.bind(this);
  this.hide = this.hide.bind(this);
  this.galleryImage.addEventListener('click', this.showNext);
  this.galleryClose.addEventListener('click', this.hide);
};

inherit(BaseComponent, Gallery);

Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

Gallery.prototype.setActivePicture = function(num) {
  this.activePicture = num;
  if((document.querySelector('img[src="' + this.pictures[num].url + '"]')) ||
    (document.querySelector('img[src="' + this.pictures[num].preview + '"]'))) {
    this.galleryImage.src = (document.querySelector('img[src="' + this.pictures[num].url + '"]')) ? (this.pictures[num].url) : (this.pictures[num].preview);
  } else {
    this.galleryImage.src = 'img/icon-warning.png';
  }
  document.querySelector('.likes-count').textContent = this.pictures[num].likes;
  document.querySelector('.comments-count').textContent = this.pictures[num].comments;
};

Gallery.prototype.show = function(num) {
  this.gallery.classList.remove('invisible');
  this.setActivePicture(num);
};

Gallery.prototype.showNext = function() {
  if(this.activePicture < this.pictures.length) {
    this.setActivePicture(this.activePicture + 1);
  } else {
    this.setActivePicture(0);
  }
};

Gallery.prototype.hide = function() {
  this.gallery.classList.add('invisible');
};

module.exports = new Gallery();
