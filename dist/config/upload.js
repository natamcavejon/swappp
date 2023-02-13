"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;














var _path = _interopRequireDefault(require("path"));
var _multer = _interopRequireDefault(require("multer")); /*
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
 */const storage = _multer.default.diskStorage({ destination: function (req, file, cb) {const __dirname = _path.default.resolve(_path.default.dirname(''));cb(null, _path.default.resolve(__dirname, 'uploads'));}, filename: function (req, file, cb) {let filename = `wppConnect-${Date.now()}-${file.originalname}`;cb(null, filename);} });const uploads = (0, _multer.default)({ storage: storage });var _default = uploads;exports.default = _default;
//# sourceMappingURL=upload.js.map