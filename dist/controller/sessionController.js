"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.checkConnectionSession = checkConnectionSession;exports.closeSession = closeSession;exports.download = download;exports.downloadMediaByMessage = downloadMediaByMessage;exports.getMediaByMessage = getMediaByMessage;exports.getQrCode = getQrCode;exports.getSessionState = getSessionState;exports.killServiceWorker = killServiceWorker;exports.logOutSession = logOutSession;exports.restartService = restartService;exports.showAllSessions = showAllSessions;exports.startAllSessions = startAllSessions;exports.startSession = startSession;exports.subscribePresence = subscribePresence;














var _sessionUtil = require("../util/sessionUtil");
var _functions = require("../util/functions");
var _createSessionUtil = _interopRequireDefault(require("../util/createSessionUtil"));
var _getAllTokens = _interopRequireDefault(require("../util/getAllTokens"));
var _fs = _interopRequireDefault(require("fs"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _package = require("../../package.json");
var _qrcode = _interopRequireDefault(require("qrcode"));
var _config = _interopRequireDefault(require("../config.json")); /*
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
 */const SessionUtil = new _createSessionUtil.default();async function downloadFileFunction(message, client, logger) {try {const buffer = await client.decryptFile(message);let filename = `./WhatsAppImages/file${message.t}`;if (!_fs.default.existsSync(filename)) {let result = '';if (message.type === 'ptt') {result = `${filename}.oga`;} else {result = `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
      }

      await _fs.default.writeFile(result, buffer, (err) => {
        if (err) {
          logger.error(err);
        }
      });

      return result;
    } else {
      return `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
    }
  } catch (e) {
    logger.error(e);
    logger.warn('Erro ao descriptografar a midia, tentando fazer o download direto...');
    try {
      const buffer = await client.downloadMedia(message);
      const filename = `./WhatsAppImages/file${message.t}`;
      if (!_fs.default.existsSync(filename)) {
        let result = '';
        if (message.type === 'ptt') {
          result = `${filename}.oga`;
        } else {
          result = `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
        }

        await _fs.default.writeFile(result, buffer, (err) => {
          if (err) {
            logger.error(err);
          }
        });

        return result;
      } else {
        return `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
      }
    } catch (e) {
      logger.error(e);
      logger.warn('Não foi possível baixar a mídia...');
    }
  }
}

async function download(message, client, logger) {
  try {
    const path = await downloadFileFunction(message, client, logger);
    return path.replace('./', '');
  } catch (e) {
    logger.error(e);
  }
}

async function startAllSessions(req, res) {
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const allSessions = await (0, _getAllTokens.default)(req);

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: 'error',
      message: 'The token is incorrect'
    });
  }

  allSessions.map(async (session) => {
    const util = new _createSessionUtil.default();
    await util.opendata(req, session);
  });

  return await res.status(201).json({ status: 'success', message: 'Starting all sessions' });
}

async function showAllSessions(req, res) {
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const arr = [];

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: false,
      message: 'The token is incorrect'
    });
  }

  Object.keys(_sessionUtil.clientsArray).forEach((item) => {
    arr.push({ session: item });
  });

  return res.status(200).json({ response: arr });
}

async function startSession(req, res) {
  const session = req.session;
  const { waitQrCode = false } = req.body;

  await getSessionState(req, res);
  await SessionUtil.opendata(req, session, waitQrCode ? res : null);
}

async function closeSession(req, res) {
  const session = req.session;
  const { clearSession = true } = req.body;
  try {
    if (_sessionUtil.clientsArray[session].status === null) {
      return await res.status(200).json({ status: true, message: 'Session successfully closed' });
    } else {
      _sessionUtil.clientsArray[session] = { status: null };

      if (clearSession) {
        let sessionFolder = `${_config.default.customUserDataDir}/${session}`;
        if (_fs.default.existsSync(sessionFolder)) {
          console.log('Deletando pasta: ' + sessionFolder);
          _fs.default.rmdirSync(sessionFolder, { recursive: true });
        }
      }
      await req.client.close();
      req.io.emit('whatsapp-status', false);
      (0, _functions.callWebHook)(req.client, req, 'closesession', {
        message: `Session: ${session} disconnected`,
        connected: false
      });

      return await res.status(200).json({ status: true, message: 'Session successfully closed' });
    }
  } catch (error) {
    req.logger.error(error);
    return await res.status(500).json({ status: false, message: 'Error closing session', error });
  }
}

async function logOutSession(req, res) {
  try {
    const session = req.session;
    await req.client.logout();

    req.io.emit('whatsapp-status', false);
    (0, _functions.callWebHook)(req.client, req, 'logoutsession', {
      message: `Session: ${session} logged out`,
      connected: false
    });

    return await res.status(200).json({ status: true, message: 'Session successfully closed' });
  } catch (error) {
    req.logger.error(error);
    return await res.status(500).json({ status: false, message: 'Error closing session', error });
  }
}

async function checkConnectionSession(req, res) {
  try {
    await req.client.isConnected();

    return res.status(200).json({ status: true, message: 'Connected' });
  } catch (error) {
    return res.status(200).json({ status: false, message: 'Disconnected' });
  }
}

async function downloadMediaByMessage(req, res) {
  const client = req.client;
  const { messageId } = req.body;

  let message;

  try {
    if (!messageId.isMedia || !messageId.type) {
      message = await client.getMessageById(messageId);
    } else {
      message = messageId;
    }

    if (!message)
    return res.status(400).json({
      status: 'error',
      message: 'Message not found'
    });

    if (!(message['mimetype'] || message.isMedia || message.isMMS))
    return res.status(400).json({
      status: 'error',
      message: 'Message does not contain media'
    });

    const buffer = await client.decryptFile(message);

    return res.status(200).json({ base64: buffer.toString('base64'), mimetype: message.mimetype });
  } catch (e) {
    req.logger.error(e);
    return res.status(400).json({
      status: 'error',
      message: 'Decrypt file error',
      error: e
    });
  }
}

async function getMediaByMessage(req, res) {
  const client = req.client;
  const { messageId } = req.params;

  try {
    const message = await client.getMessageById(messageId);

    if (!message)
    return res.status(400).json({
      status: 'error',
      message: 'Message not found'
    });

    if (!(message['mimetype'] || message.isMedia || message.isMMS))
    return res.status(400).json({
      status: 'error',
      message: 'Message does not contain media'
    });

    const buffer = await client.decryptFile(message);

    return res.status(200).json({ base64: buffer.toString('base64'), mimetype: message.mimetype });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', message: 'The session is not active', error: ex });
  }
}

async function getSessionState(req, res) {
  try {
    const { waitQrCode = false } = req.body;
    const client = req.client;
    const qr = (client === null || client === void 0 ? void 0 : client.urlcode) != null && (client === null || client === void 0 ? void 0 : client.urlcode) != '' ? await _qrcode.default.toDataURL(client.urlcode) : null;

    if ((client == null || client.status == null) && !waitQrCode)
    return res.status(200).json({ status: 'CLOSED', qrcode: null });else
    if (client != null)
    return res.status(200).json({
      status: client.status,
      qrcode: qr,
      urlcode: client.urlcode,
      version: _package.version
    });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', message: 'The session is not active', error: ex });
  }
}

async function getQrCode(req, res) {
  try {
    if (req.client.urlcode) {
      const qr = req.client.urlcode ? await _qrcode.default.toDataURL(req.client.urlcode) : null;
      const img = Buffer.from(qr.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
    } else {
      return res.status(200).json({ status: req.client.status, message: 'QRCode is not available...' });
    }
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', message: 'Error retrieving QRCode', error: ex });
  }
}

async function killServiceWorker(req, res) {
  try {
    return res.status(200).json({ status: 'success', response: req.client.killServiceWorker() });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', message: 'The session is not active', error: ex });
  }
}

async function restartService(req, res) {
  try {
    return res.status(200).json({ status: 'success', response: req.client.restartService() });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', response: { message: 'The session is not active', error: ex } });
  }
}

async function subscribePresence(req, res) {
  try {
    const { phone, isGroup = false, all = false } = req.body;

    if (all) {
      let contacts;
      if (isGroup) {
        const groups = await req.client.getAllGroups(false);
        contacts = groups.map((p) => p.id._serialized);
      } else {
        const chats = await req.client.getAllContacts();
        contacts = chats.map((c) => c.id._serialized);
      }
      await req.client.subscribePresence(contacts);
    } else
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      await req.client.subscribePresence(contato);
    }

    return await res.status(200).json({ status: 'success', response: { message: 'Subscribe presence executed' } });
  } catch (error) {
    return await res.status(500).json({ status: 'error', message: 'Error on subscribe presence', error: error });
  }
}
//# sourceMappingURL=sessionController.js.map