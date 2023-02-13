"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _config = _interopRequireDefault(require("../../../config.json"));

let mongoose = _config.default.tokenStoreType === 'mongodb' ? require('../../db/mongodb/db') : null;
let Token = null;

if (_config.default.tokenStoreType === 'mongodb') {
  const TokenSchema = new mongoose.Schema({
    WABrowserId: String,
    WASecretBundle: String,
    WAToken1: String,
    WAToken2: String,
    webhook: String,
    config: String,
    sessionName: String
  });
  Token = mongoose.model('Token', TokenSchema);
}

module.exports = Token;
//# sourceMappingURL=token.js.map