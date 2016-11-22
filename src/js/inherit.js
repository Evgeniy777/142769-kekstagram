'use strict';

var inherit = function(parent, child) {
  var EmptyConstructor = function() {
  };
  EmptyConstructor.prototype = parent.prototype;
  child.prototype = new EmptyConstructor();
};

module.exports = inherit;
