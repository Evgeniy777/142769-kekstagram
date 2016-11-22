'use strict';

var BaseComponent = function(element) {
  this.element = element;
};
BaseComponent.prototype.show = function(parent, element) {
  parent.appendChild(element);
};
BaseComponent.prototype.remove = function() {
  this.element.parentNode.removeChild(this.element);
};
module.exports = BaseComponent;
