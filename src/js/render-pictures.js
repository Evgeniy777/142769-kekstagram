'use strict';
module.exports = function() {
  var gallery = require('./gallery');
  var load = require('./load');
  var Picture = require('./picture');
  var container = document.querySelector('.pictures.container');
  var PICTURES_LOAD_URL = '/api/pictures';
  var THROTTLE_TIMEOUT = 200;
  var GAP = 100;
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
  var renderPictures = function(pictures) {
    hideFilters();
    pictures.forEach(function(picture, num) {
      container.appendChild(new Picture(picture, num).element);
    });
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
    addMorePictures();
  };
  var changeFilter = function(filterID) {
    container.innerHTML = '';
    activeFilter = filterID;
    pageNumber = 0;
    loadPictures(activeFilter, pageNumber);
  };
  filters.addEventListener('change', function(evt) {
    activeFilter = evt.target.getAttribute('id');
    changeFilter(activeFilter);
  }, true);
  var addMorePictures = function() {
    if (footer.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom > GAP) {
      var params = {
        from: 0,
        to: 12
      };
      load(PICTURES_LOAD_URL, params, renderPictures);
    }
  };
  function throttle(func, timeout) {
    var lastCall = Date.now();
    return function() {
      if (Date.now() - lastCall >= timeout) {
        func();
        lastCall = Date.now();
      }
    }
  }
  var optimizedScroll = throttle(function() {
    if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
      loadPictures(activeFilter, ++pageNumber);
    }
  }, 100);
  window.addEventListener('scroll', optimizedScroll);
  changeFilter(activeFilter);
};
