"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sessions = exports.eventEmitter = exports.clientsArray = exports.chromiumArgs = void 0;














var _events = require("events"); /*
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
 */const chromiumArgs = ['--disable-web-security', '--no-sandbox', '--disable-web-security', '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache', '--disable-offline-load-stale-cache', '--disk-cache-size=0', '--disable-background-networking', '--disable-default-apps', '--disable-extensions', '--disable-sync', '--disable-translate',
'--hide-scrollbars',
'--metrics-recording-only',
'--mute-audio',
'--no-first-run',
'--safebrowsing-disable-auto-update',
'--ignore-certificate-errors',
'--ignore-ssl-errors',
'--ignore-certificate-errors-spki-list'];exports.chromiumArgs = chromiumArgs;

let clientsArray = [];exports.clientsArray = clientsArray;
let sessions = [];exports.sessions = sessions;
const eventEmitter = new _events.EventEmitter();exports.eventEmitter = eventEmitter;
//# sourceMappingURL=sessionUtil.js.map