"use strict";

/* istanbul ignore next  */
function setAttributesWithoutAttributes(style, attributes) {
  var nonce = typeof __webpack_nonce__ !== "undefined" ? __webpack_nonce__ : null;

  if (nonce) {
    attributes.nonce = nonce;
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });
}

module.exports = setAttributesWithoutAttributes;