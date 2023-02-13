"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _db = _interopRequireDefault(require("../db/redis/db"));
var _config = _interopRequireDefault(require("../../config.json"));
var _functions = require("../functions");

var RedisTokenStore = function (client) {
  let prefix = _config.default.db.redisPrefix || '';
  if (prefix === 'docker') {
    prefix = (0, _functions.getIPAddress)();
  }
  this.tokenStore = {
    getToken: (sessionName) =>
    new Promise((resolve, reject) => {
      _db.default.get(prefix + sessionName, (err, reply) => {
        if (err) {
          return reject(err);
        }
        const object = JSON.parse(reply);
        if (object) {
          if (object.config && Object.keys(client.config).length === 0) client.config = object.config;
          if (object.webhook && Object.keys(client.config).length === 0) client.config.webhook = object.webhook;
        }
        resolve(object);
      });
    }),
    setToken: (sessionName, tokenData) =>
    new Promise((resolve) => {
      tokenData.sessionName = sessionName;
      tokenData.config = client.config;
      _db.default.set(prefix + sessionName, JSON.stringify(tokenData), (err) => {
        return resolve(err ? false : true);
      });
    }),
    removeToken: (sessionName) =>
    new Promise((resolve) => {
      _db.default.del(prefix + sessionName, (err) => {
        return resolve(err ? false : true);
      });
    }),
    listTokens: () =>
    new Promise((resolve) => {
      _db.default.keys(prefix + '*', (err, keys) => {
        if (err) {
          return resolve([]);
        }
        keys.forEach((item, indice) => {
          if (prefix !== '' && item.includes(prefix)) {
            keys[indice] = item.substring(item.indexOf(prefix) + prefix.length);
          }
        });
        return resolve(keys);
      });
    })
  };
};

module.exports = RedisTokenStore;
//# sourceMappingURL=redisTokenStory.js.map