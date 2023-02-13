"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.convert = convert;var _jsonMapperJson = _interopRequireDefault(require("json-mapper-json"));function _getRequireWildcardCache(nodeInterop) {if (typeof WeakMap !== "function") return null;var cacheBabelInterop = new WeakMap();var cacheNodeInterop = new WeakMap();return (_getRequireWildcardCache = function (nodeInterop) {return nodeInterop ? cacheNodeInterop : cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj, nodeInterop) {if (!nodeInterop && obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache(nodeInterop);if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

async function convert(prefix, data, event) {
  try {
    data.event = event || data.event;
    event = data.event.indexOf('message') >= 0 ? 'message' : data.event;

    let mappConfEvent = await config_event(prefix, event);
    let mappConfType = await config_type(prefix, event, data.type);

    Object.assign(mappConfEvent, mappConfType);

    // console.log('mappConfEvent', mappConfEvent);

    if (!mappConfEvent) return data;
    return await (0, _jsonMapperJson.default)(data, mappConfEvent);
  } catch (e) {
    return data;
  }
}

async function config_event(prefix, event) {
  try {
    let { default: mappConf } = await ((specifier) => new Promise((r) => r(specifier)).then((s) => _interopRequireWildcard(require(s))))(`./${prefix}${event}.js`);
    if (!mappConf) return undefined;
    return mappConf;
  } catch (e) {
    return undefined;
  }
}

async function config_type(prefix, event, type) {
  try {
    let { default: mappConf } = await ((specifier) => new Promise((r) => r(specifier)).then((s) => _interopRequireWildcard(require(s))))(`./${prefix}${event}-${type}.js`);
    if (!mappConf) return undefined;
    return mappConf;
  } catch (e) {
    return undefined;
  }
}
//# sourceMappingURL=index.js.map