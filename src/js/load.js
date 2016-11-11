'use strict';

module.exports = function(url, params, callback) {
  var getSearchString = function(params) {
    return Object.keys(params).map(function(param) {
      return [param, params[param]].join('=');
    }).join('&');
  };
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var data = JSON.parse(evt.target.response);
    callback(data);
  };

  xhr.open('GET', url + '?' + getSearchString(params));
  xhr.send();
};
