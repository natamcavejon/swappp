"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.createLogger = createLogger;














var _winston = _interopRequireDefault(require("winston")); /*
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
 */ // Use JSON logging for log files
// Here winston.format.errors() just seem to work
// because there is no winston.format.simple()
const jsonLogFileFormat = _winston.default.format.combine(_winston.default.format.errors({ stack: true }), _winston.default.format.timestamp(), _winston.default.format.prettyPrint());function createLogger(options) {const log_level = options.level; // Create file loggers
  const logger = _winston.default.createLogger({ level: 'debug', format: jsonLogFileFormat, expressFormat: true });

  // When running locally, write everything to the console
  // with proper stacktraces enabled
  if (options.logger.indexOf('console') > -1) {
    logger.add(
    new _winston.default.transports.Console({
      format: _winston.default.format.combine(
      _winston.default.format.errors({ stack: true }),
      _winston.default.format.colorize(),
      _winston.default.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          // print log trace
          return `${level}: ${timestamp} ${message} - ${stack}`;
        }
        return `${level}: ${timestamp} ${message}`;
      }))

    }));

  }
  if (options.logger.indexOf('file') > -1) {
    logger.add(
    new _winston.default.transports.File({
      filename: './log/app.logg',
      level: log_level,
      maxsize: 10485760,
      maxFiles: 3
    }));

  }

  return logger;
}
//# sourceMappingURL=logger.js.map