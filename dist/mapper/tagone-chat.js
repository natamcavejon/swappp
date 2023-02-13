"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  id: 'id',
  type: 'kind',
  phone: {
    path: 'id.user',
    formatting: (value) => {
      return value.split('@')[0];
    }
  },
  author: {
    path: 'contact',
    formatting: (value) => {
      return value.isMyContact ? value.formattedName : value.pushname;
    }
  },
  timestamp: 't'
};exports.default = _default;
//# sourceMappingURL=tagone-chat.js.map