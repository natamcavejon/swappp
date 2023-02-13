"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  caption: {
    path: '$item',
    formatting: (value) => {
      return value.caption || '';
    }
  },
  mimetype: 'mimetype',
  size: 'size',
  filename: 'filename',
  pageCount: 'pageCount',
  fileUrl: {
    path: '$item',
    formatting: (value) => {
      return value.fileUrl || '';
    }
  }
};exports.default = _default;
//# sourceMappingURL=tagone-message-document.js.map