"use strict";var wppconnect = _interopRequireWildcard(require("@wppconnect-team/wppconnect"));function _getRequireWildcardCache(nodeInterop) {if (typeof WeakMap !== "function") return null;var cacheBabelInterop = new WeakMap();var cacheNodeInterop = new WeakMap();return (_getRequireWildcardCache = function (nodeInterop) {return nodeInterop ? cacheNodeInterop : cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj, nodeInterop) {if (!nodeInterop && obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache(nodeInterop);if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

var FileTokenStore = function (client) {
  this.tokenStore = new wppconnect.tokenStore.FileTokenStore({
    encodeFunction: (data) => {
      return this.encodeFunction(data, client.config);
    },
    decodeFunction: (text) => {
      return this.decodeFunction(text, client);
    }
  });

  this.encodeFunction = function (data, config) {
    data.config = config;
    return JSON.stringify(data);
  };

  this.decodeFunction = function (text, client) {
    let object = JSON.parse(text);
    if (object.config && Object.keys(client.config).length === 0) client.config = object.config;
    if (object.webhook && Object.keys(client.config).length === 0) client.config.webhook = object.webhook;
    return object;
  };
};

module.exports = FileTokenStore;
//# sourceMappingURL=fileTokenStory.js.map