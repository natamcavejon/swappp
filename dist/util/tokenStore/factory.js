"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _config = _interopRequireDefault(require("../../config.json"));
var _fileTokenStory = _interopRequireDefault(require("./fileTokenStory"));
var _mongodbTokenStory = _interopRequireDefault(require("./mongodbTokenStory"));
var _redisTokenStory = _interopRequireDefault(require("./redisTokenStory"));
var _firebaseTokenStory = _interopRequireDefault(require("./firebaseTokenStory"));

var Factory = function () {
  this.createTokenStory = function (client) {
    var myTokenStore;
    const type = _config.default.tokenStoreType;

    if (type === 'mongodb') {
      myTokenStore = new _mongodbTokenStory.default(client);
    } else if (type === 'redis') {
      myTokenStore = new _redisTokenStory.default(client);
    } else if (type === 'firebase') {
      myTokenStore = new _firebaseTokenStory.default();
    } else {
      myTokenStore = new _fileTokenStory.default(client);
    }

    return myTokenStore.tokenStore;
  };
};

module.exports = Factory;
//# sourceMappingURL=factory.js.map