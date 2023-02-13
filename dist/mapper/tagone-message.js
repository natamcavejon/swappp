"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  event: 'event',
  session: 'session',
  id: 'id',
  content: {
    path: '$item',
    formatting: (value) => {
      return value.mimetype ? value.caption || '' : value.body;
    }
  },
  type: 'type',
  timestamp: 't',
  phone: {
    path: 'from',
    formatting: (value) => {
      return value.split('@')[0];
    }
  },
  status: 'ack',
  isGroupMsg: 'isGroupMsg',
  contactName: {
    path: 'sender',
    formatting: (value) => {
      return value.isMyContact ? value.formattedName : value.pushname;
    }
  },
  imgContactUrl: 'sender.profilePicThumbObj.eurl'
};exports.default = _default;
//# sourceMappingURL=tagone-message.js.map