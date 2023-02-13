"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.initServer = initServer;

















var _logger = require("./util/logger");
var _functions = require("./util/functions");
var _cors = _interopRequireDefault(require("cors"));
var _express = _interopRequireDefault(require("express"));
var _http = require("http");
var _socket = require("socket.io");
var _routes = _interopRequireDefault(require("./routes"));
var _config = _interopRequireDefault(require("./config.json"));
var _expressQueryBoolean = _interopRequireDefault(require("express-query-boolean"));
var _mergeDeep = _interopRequireDefault(require("merge-deep"));
var _index = require("./mapper/index");
var _package = require("../package.json"); /*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */require('dotenv').config();function initServer(serverOptions) {if (typeof serverOptions !== 'object') {serverOptions = {};}serverOptions = (0, _mergeDeep.default)({}, _config.default, serverOptions);(0, _functions.setMaxListners)(serverOptions);const logger = (0, _logger.createLogger)(serverOptions.log);const app = (0, _express.default)();const PORT = process.env.PORT || serverOptions.port;

  const http = new _http.createServer(app);
  const io = new _socket.Server(http, {
    cors: true,
    origins: ['*']
  });

  app.use((0, _cors.default)());
  app.use(_express.default.json({ limit: '50mb' }));
  app.use(_express.default.urlencoded({ limit: '50mb', extended: true }));
  app.use('/files', _express.default.static('WhatsAppImages'));
  app.use((0, _expressQueryBoolean.default)());

  // Add request options
  app.use((req, res, next) => {
    req.serverOptions = serverOptions;
    req.logger = logger;
    req.io = io;

    var oldSend = res.send;

    res.send = async function (data) {
      const content = req.headers['content-type'];
      if (content == 'application/json') {
        data = JSON.parse(data);
        if (!data.session) data.session = req.client ? req.client.session : '';
        if (data.mapper && req.serverOptions.mapper.enable) {
          data.response = await (0, _index.convert)(req.serverOptions.mapper.prefix, data.response, data.mapper);
          delete data.mapper;
        }
      }
      res.send = oldSend;
      return res.send(data);
    };
    next();
  });

  io.on('connection', (sock) => {
    logger.info(`ID: ${sock.id} entrou`);

    sock.on('disconnect', () => {
      logger.info(`ID: ${sock.id} saiu`);
    });
  });

  app.use(_routes.default);

  (0, _functions.createFolders)();

  http.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
    logger.info(`\x1b[31m Visit ${serverOptions.host}:${PORT}/api-docs for Swagger docs`);
    logger.info(`WPPConnect-Server version: ${_package.version}`);

    if (serverOptions.startAllSession) (0, _functions.startAllSessions)(serverOptions, logger);
  });

  return {
    app,
    routes: _routes.default,
    logger
  };
}
//# sourceMappingURL=index.js.map