'use strict';

var getPictureElement = function(picture, num) {
  var gallery = require('./gallery');
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;
  var IMG_WIDTH = 182;
  var IMG_HEIGHT = 182;
  var IMAGE_LOAD_TIMEOUT = 10000;
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;
  pictureElement.setAttribute('href', picture.url);
  var image = new Image();
  var imageTimeout = null;
  image.onload = function() {
    clearTimeout(imageTimeout);
    pictureElement.querySelector('img').src = picture.url || picture.preview;
    pictureElement.querySelector('img').width = IMG_WIDTH;
    pictureElement.querySelector('img').height = IMG_HEIGHT;
  };
  image.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };
  imageTimeout = setTimeout(function() {
    pictureElement.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  image.setAttribute('src', picture.url || picture.preview);
  
  pictureElement.onclick = function(event) {
    event.preventDefault();

    if(!pictureElement.classList.contains('picture-load-failure')) {
      gallery.show(num);
    }
  };
  return pictureElement;
};

module.exports = getPictureElement;
