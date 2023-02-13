"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = getAllTokens;














var _factory = _interopRequireDefault(require("./tokenStore/factory")); /*
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
 */async function getAllTokens(req) {const tokenStore = new _factory.default();const myTokenStore = tokenStore.createTokenStory(null);try {return await myTokenStore.listTokens();} catch (e) {req.logger.error(e);}}
//# sourceMappingURL=getAllTokens.js.map