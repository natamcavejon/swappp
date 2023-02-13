"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _config = _interopRequireDefault(require("../../../config.json")); //import mongoose from 'mongoose';

let mongoose = _config.default.tokenStoreType === 'mongodb' ? require('mongoose') : null;

if (_config.default.tokenStoreType === 'mongodb') {
  mongoose.Promise = global.Promise;
  const userAndPassword =
  _config.default.db.mongodbUser && _config.default.db.mongodbPassword ? `${_config.default.db.mongodbUser}:${_config.default.db.mongodbPassword}@` : '';

  if (!_config.default.db.mongoIsRemote) {
    mongoose.connect(
    `mongodb://${userAndPassword}${_config.default.db.mongodbHost}:${_config.default.db.mongodbPort}/${_config.default.db.mongodbDatabase}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

  } else {
    mongoose.connect(_config.default.db.mongoURLRemote, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = mongoose;
//# sourceMappingURL=db.js.map