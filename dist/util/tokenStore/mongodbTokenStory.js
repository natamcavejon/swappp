"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _token = _interopRequireDefault(require("./model/token"));

var MongodbTokenStore = function (client) {
  this.tokenStore = {
    getToken: async (sessionName) => {
      let result = await _token.default.findOne({ sessionName });
      if (result === null) return result;
      result = JSON.parse(JSON.stringify(result));
      result.config = JSON.parse(result.config);
      result.config.webhook = result.webhook;
      client.config = result.config;
      return result;
    },
    setToken: async (sessionName, tokenData) => {
      const token = new _token.default(tokenData);
      token.sessionName = sessionName;
      token.webhook = client.config.webhook;
      token.config = JSON.stringify(client.config);

      let tk = await _token.default.findOne({ sessionName });

      if (tk) {
        token._id = tk._id;
        return (await _token.default.updateOne({ _id: tk._id }, token)) ? true : false;
      } else {
        return (await token.save()) ? true : false;
      }
    },
    removeToken: async (sessionName) => {
      return (await _token.default.deleteOne({ sessionName })) ? true : false;
    },
    listTokens: async () => {
      const result = await _token.default.find();
      return result.map((m) => m.sessionName);
    }
  };
};

module.exports = MongodbTokenStore;
//# sourceMappingURL=mongodbTokenStory.js.map