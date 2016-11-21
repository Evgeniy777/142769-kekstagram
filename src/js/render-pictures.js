'use strict';
module.exports = function() {
  var gallery = require('./gallery');
  var load = require('./load');
  var Picture = require('./picture');
  var container = document.querySelector('.pictures.container');
  var PICTURES_LOAD_URL = '/api/pictures';
  var GAP = 100;
  var pictures = [];
  var pageNumber = 0;
  var pageSize = 12;
  var activeFilter = 'filter-popular';
  var filters = document.querySelector('.filters');
  var footer = document.querySelector('footer');

  var hideFilters = function() {
    document.querySelector('.filters').classList.add('hidden');
  };

  var showFilters = function() {
    document.querySelector('.filters').classList.remove('hidden');
  };
  var renderPictures = function(loadedPictures) {
    hideFilters();
    pictures = pictures.concat(loadedPictures);
    if(pictures.length > loadedPictures.length) {
      var picNum = pictures.length - loadedPictures.length;
    }
    loadedPictures.forEach(function(picture, num) {
      if (picNum >= loadedPictures.length) {
        num = picNum;
      }
      container.appendChild(new Picture(picture, num).element);
      picNum++;
    });
    addMorePictures();
    gallery.setPictures(pictures);
    showFilters();
  };
  var loadPictures = function(filter, currentPageNumber) {
    var params = {
      from: currentPageNumber * pageSize,
      to: currentPageNumber * pageSize + pageSize,
      filter: filter
    };
    load(PICTURES_LOAD_URL, params, renderPictures);
  };
  var changeFilter = function(filterID) {
    container.innerHTML = '';
    activeFilter = filterID;
    pageNumber = 0;
    pictures = [];
    loadPictures(activeFilter, pageNumber);
  };
  filters.addEventListener('change', function(evt) {
    activeFilter = evt.target.getAttribute('id');
    changeFilter(activeFilter);
  }, true);
  var addMorePictures = function() {
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.body.clientHeight;
    if(clientHeight <= scrollHeight) {
      loadPictures(activeFilter, ++pageNumber);
    }
  };
  function throttle(func, timeout) {
    var lastCall = Date.now();
    return function() {
      if (Date.now() - lastCall >= timeout) {
        func();
        lastCall = Date.now();
      }
    };
  }
  var optimizedScroll = throttle(function() {
    if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
      loadPictures(activeFilter, ++pageNumber);
    }
  }, 100);
  window.addEventListener('scroll', optimizedScroll);
  changeFilter(activeFilter);
};
