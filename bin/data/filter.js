'use strict';

module.exports = function (list, filterID) {
  var THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  
  switch (filterID) {
  case 'filter-popular':
    var regularOrder = list;
    return regularOrder;
    break;

  case 'filter-new':
    return list.filter(function (item) {
      return (Date.now() - item.created) <= (THREE_DAYS);
    }).sort(function (a, b) {
      return b.created - a.created;
    });
    break;

  case 'filter-discussed':
    return list.sort(function (a, b) {
      return b.comments - a.comments;
    });
    break;
  }
};
