"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _config = _interopRequireDefault(require("../../../config.json"));
let redis = _config.default.tokenStoreType === 'redis' ? require('redis') : null;
let RedisClient = null;

if (_config.default.tokenStoreType === 'redis') {
  RedisClient = redis.createClient(_config.default.db.redisPort, _config.default.db.redisHost, {
    password: _config.default.db.redisPassword,
    db: _config.default.db.redisDb
  });
}

module.exports = RedisClient;
//# sourceMappingURL=db.js.map