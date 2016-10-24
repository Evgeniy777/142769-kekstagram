'use strict';

var container = document.querySelector('.pictures.container');
var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;
var pictures = [];
var IMG_WIDTH = 182;
var IMG_HEIGHT = 182;
var IMAGE_LOAD_TIMEOUT = 10000;
var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';

var load = function (url, callback, callbackName) {
  if (!callbackName) {
    callbackName = 'cb' + Date.now();
  }
  
  window[callbackName] = function (data) {
    pictures = data;
    callback(data);
  };
  
  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

var hideFilters = function () {
  document.querySelector('.filters').classList.add('hidden');
  return pictures;
};

var getPictureElement = function (picture) {
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;
  pictureElement.setAttribute('href', picture.url);
  var image = new Image();
  var imageTimeout = null;
  image.onload = function () {
    clearTimeout(imageTimeout);
    pictureElement.querySelector('img').src = picture.url;
    pictureElement.querySelector('img').width = IMG_WIDTH;
    pictureElement.querySelector('img').height = IMG_HEIGHT;
  };
  image.onerror = function () {
    pictureElement.classList.add('picture-load-failure');
  };
  imageTimeout = setTimeout(function () {
    pictureElement.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  image.setAttribute('src', picture.url);
  return pictureElement;
};

var showFilters = function () {
  document.querySelector('.filters').classList.remove('hidden');
};

var renderPictures = function () {
  hideFilters();
  pictures.forEach(function (picture) {
    container.appendChild(getPictureElement(picture));
  });
  showFilters();
};

//renderPictures(showFilters);

load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');