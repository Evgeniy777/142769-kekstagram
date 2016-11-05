'use strict';

var Gallery = function () {
  this.pictures = [];
  this.activePicture = 0;
  this.gallery = document.querySelector('.gallery-overlay');
  this.galleryClose = document.querySelector('.gallery-overlay-close');
  this.galleryImage = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function (pictures) {
  this.pictures = pictures;
};

Gallery.prototype.show = function (num) {
  var self = this;
  
  this.galleryClose.onclick = function() {
    self.hide();
  };
  
  this.galleryImage.onclick = function () {
    if(self.activePicture < self.pictures.length) {
      self.setActivePicture(self.activePicture + 1);
    } else {
      self.setActivePicture(0);
    }
  };
  
  this.gallery.classList.remove('invisible');
  
  this.setActivePicture(num);
  
};

Gallery.prototype.hide = function (pictures) {
  var self = this;
  this.gallery.classList.add('invisible');
  this.galleryClose.onclick = null;
  this.galleryImage.onclick = null;
};

Gallery.prototype.setActivePicture = function (num) {
  this.activePicture = num;
  
  this.galleryImage.src = this.pictures[num].preview || this.pictures[num].url;
  document.querySelector('.likes-count').textContent = this.pictures[num].likes;
  document.querySelector('.comments-count').textContent = this.pictures[num].comments;
};

module.exports = new Gallery();