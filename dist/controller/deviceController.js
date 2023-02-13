"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.archiveAllChats = archiveAllChats;exports.archiveChat = archiveChat;exports.blockContact = blockContact;exports.chatWoot = chatWoot;exports.checkNumberStatus = checkNumberStatus;exports.clearAllChats = clearAllChats;exports.clearChat = clearChat;exports.deleteAllChats = deleteAllChats;exports.deleteChat = deleteChat;exports.deleteMessage = deleteMessage;exports.forwardMessages = forwardMessages;exports.getAllChats = getAllChats;exports.getAllChatsWithMessages = getAllChatsWithMessages;exports.getAllContacts = getAllContacts;exports.getAllMessagesInChat = getAllMessagesInChat;exports.getAllNewMessages = getAllNewMessages;exports.getAllUnreadMessages = getAllUnreadMessages;exports.getBatteryLevel = getBatteryLevel;exports.getBlockList = getBlockList;exports.getChatById = getChatById;exports.getChatIsOnline = getChatIsOnline;exports.getContact = getContact;exports.getHostDevice = getHostDevice;exports.getLastSeen = getLastSeen;exports.getListMutes = getListMutes;exports.getMessageById = getMessageById;exports.getMessages = getMessages;exports.getNumberProfile = getNumberProfile;exports.getPhoneNumber = getPhoneNumber;exports.getProfilePicFromServer = getProfilePicFromServer;exports.getReactions = getReactions;exports.getStatus = getStatus;exports.getUnreadMessages = getUnreadMessages;exports.getVotes = getVotes;exports.loadAndGetAllMessagesInChat = loadAndGetAllMessagesInChat;exports.markUnseenMessage = markUnseenMessage;exports.pinChat = pinChat;exports.reactMessage = reactMessage;exports.rejectCall = rejectCall;exports.reply = reply;exports.sendContactVcard = sendContactVcard;exports.sendMute = sendMute;exports.sendSeen = sendSeen;exports.setChatState = setChatState;exports.setProfileName = setProfileName;exports.setProfilePic = setProfilePic;exports.setProfileStatus = setProfileStatus;exports.setRecording = setRecording;exports.setTemporaryMessages = setTemporaryMessages;exports.setTyping = setTyping;exports.showAllContacts = showAllContacts;exports.starMessage = starMessage;exports.unblockContact = unblockContact;














var _fs = _interopRequireDefault(require("fs"));
var _sessionController = require("./sessionController");
var _functions = require("../util/functions");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _sessionUtil = require("../util/sessionUtil"); /*
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
 */function returnSucess(res, session, phone, data) {res.status(201).json({ status: 'Success', response: { message: 'Information retrieved successfully.', contact: phone, session: session, data: data } });}function returnError(req, res, session, error) {
  req.logger.error(error);
  res.status(400).json({
    status: 'Error',
    response: {
      message: 'Error retrieving information',
      session: session,
      log: error
    }
  });
}

async function setProfileName(req, res) {
  const { name } = req.body;

  if (!name) return res.status(400).json({ status: 'error', message: 'Parameter name is required!' });

  try {
    const result = await req.client.setProfileName(name);
    return res.status(200).json({ status: 'success', response: result });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ status: 'error', message: 'Error on set profile name.', error: error });
  }
}

async function showAllContacts(req, res) {
  try {
    const contacts = await req.client.getAllContacts();
    res.status(200).json({ status: 'success', response: contacts });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching contacts', error: error });
  }
}

async function getAllChats(req, res) {
  try {
    const response = await req.client.getAllChats();
    return res.status(200).json({ status: 'success', response: response, mapper: 'chat' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on get all chats' });
  }
}

async function getAllChatsWithMessages(req, res) {
  try {
    const response = await req.client.getAllChatsWithMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on get all chats whit messages', error: e });
  }
}
/**
 * Depreciado em favor de getMessages
 */
async function getAllMessagesInChat(req, res) {
  try {
    let { phone } = req.params;
    const { isGroup = false, includeMe = true, includeNotifications = true } = req.query;

    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.getAllMessagesInChat(contato, includeMe, includeNotifications);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on get all messages in chat', error: e });
  }
}

async function getAllNewMessages(req, res) {
  try {
    const response = await req.client.getAllNewMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on get all messages in chat', error: e });
  }
}

async function getAllUnreadMessages(req, res) {
  try {
    const response = await req.client.getAllUnreadMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on get all messages in chat', error: e });
  }
}

async function getChatById(req, res) {
  const { phone } = req.params;
  const { isGroup } = req.query;

  try {
    let allMessages = {};

    if (isGroup) {
      allMessages = await req.client.getAllMessagesInChat(`${phone}@g.us`, true, true);
    } else {
      allMessages = await req.client.getAllMessagesInChat(`${phone}@c.us`, true, true);
    }

    let dir = './WhatsAppImages';
    if (!_fs.default.existsSync(dir)) {
      _fs.default.mkdirSync(dir);
    }

    allMessages.map((message) => {
      if (message.type === 'sticker') {
        (0, _sessionController.download)(message, req.client, req.logger);
        message.body = `${req.serverOptions.host}:${req.serverOptions.port}/files/file${message.t}.${_mimeTypes.default.extension(
        message.mimetype)
        }`;
      }
    });

    return res.status(200).json({ status: 'success', response: allMessages });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error changing chat by Id', error: e });
  }
}

async function getMessageById(req, res) {
  const session = req.session;
  const { messageId } = req.params;

  try {
    let result;

    result = await req.client.getMessageById(messageId);

    returnSucess(res, session, result.chatId.user, result);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function getBatteryLevel(req, res) {
  try {
    let response = await req.client.getBatteryLevel();
    return res.status(200).json({ status: 'Success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error retrieving battery status', error: e });
  }
}

async function getHostDevice(req, res) {
  try {
    const response = await req.client.getHostDevice();
    const phoneNumber = await req.client.getWid();
    return res.status(200).json({ status: 'success', response: { ...response, phoneNumber }, mapper: 'device' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Erro ao recuperar dados do telefone', error: e });
  }
}

async function getPhoneNumber(req, res) {
  try {
    const phoneNumber = await req.client.getWid();
    return res.status(200).json({ status: 'success', response: phoneNumber, mapper: 'device' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error retrieving phone number', error: e });
  }
}

async function getBlockList(req, res) {
  let response = await req.client.getBlockList();

  try {
    const blocked = response.map((contato) => {
      return { phone: contato ? contato.split('@')[0] : '' };
    });

    return res.status(200).json({ status: 'success', response: blocked });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error retrieving blocked contact list', error: e });
  }
}

async function deleteChat(req, res) {
  const { phone } = req.body;
  const session = req.session;

  try {
    let results = {};
    for (const contato of phone) {
      results[contato] = await req.client.deleteChat(contato);
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}
async function deleteAllChats(req, res) {
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.deleteChat(chat.chatId);
    }
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on delete all chats', error: error });
  }
}

async function clearChat(req, res) {
  const { phone } = req.body;
  const session = req.session;

  try {
    let results = {};
    for (const contato of phone) {
      results[contato] = await req.client.clearChat(contato);
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function clearAllChats(req, res) {
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.clearChat(`${chat.chatId}`);
    }
    return res.status(201).json({ status: 'success' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on clear all chats', error: e });
  }
}

async function archiveChat(req, res) {
  const { phone, value = true } = req.body;

  try {
    let response;
    response = await req.client.archiveChat(`${phone}`, value);
    return res.status(201).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on archive chat', error: e });
  }
}

async function archiveAllChats(req, res) {
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.archiveChat(`${chat.chatId}`, true);
    }
    return res.status(201).json({ status: 'success' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on archive all chats', error: e });
  }
}

async function deleteMessage(req, res) {
  const { phone, messageId } = req.body;

  try {
    await req.client.deleteMessage(`${phone}`, [messageId]);

    return res.status(200).json({ status: 'success', response: { message: 'Message deleted' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on delete message', error: e });
  }
}
async function reactMessage(req, res) {
  const { msgId, reaction } = req.body;

  try {
    await req.client.sendReactionToMessage(msgId, reaction);

    return res.status(200).json({ status: 'success', response: { message: 'Reaction sended' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on send reaction to message', error: e });
  }
}

async function reply(req, res) {
  const { phone, text, messageid } = req.body;

  try {
    let response = await req.client.reply(`${phone}@c.us`, text, messageid);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error replying message', error: e });
  }
}

async function forwardMessages(req, res) {
  const { phone, messageId, isGroup = false } = req.body;

  try {
    let response;

    if (!isGroup) {
      response = await req.client.forwardMessages(`${phone}`, [messageId], false);
    } else {
      response = await req.client.forwardMessages(`${phone}`, [messageId], false);
    }

    return res.status(201).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error forwarding message', error: e });
  }
}

async function markUnseenMessage(req, res) {
  const { phone } = req.body;

  try {
    await req.client.markUnseenMessage(`${phone}`);
    return res.status(200).json({ status: 'success', response: { message: 'unseen checked' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on mark unseen', error: e });
  }
}

async function blockContact(req, res) {
  const { phone } = req.body;

  try {
    await req.client.blockContact(`${phone}`);
    return res.status(200).json({ status: 'success', response: { message: 'Contact blocked' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on block contact', error: e });
  }
}

async function unblockContact(req, res) {
  const { phone } = req.body;

  try {
    await req.client.unblockContact(`${phone}`);
    return res.status(200).json({ status: 'success', response: { message: 'Contact UnBlocked' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on unlock contact', error: e });
  }
}

async function pinChat(req, res) {
  const { phone, state } = req.body;

  try {
    for (const contato of phone) {
      await req.client.pinChat(contato, state === 'true', false);
    }

    return res.status(200).json({ status: 'success', response: { message: 'Chat fixed' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: e.text || 'Error on pin chat', error: e });
  }
}

async function setProfilePic(req, res) {
  if (!req.file) return res.status(400).json({ status: 'Error', message: 'File parameter is required!' });

  try {
    const { path: pathFile } = req.file;

    await req.client.setProfilePic(pathFile);
    await (0, _functions.unlinkAsync)(pathFile);

    return res.status(200).json({ status: 'success', response: { message: 'Profile photo successfully changed' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error changing profile photo', error: e });
  }
}

async function getUnreadMessages(req, res) {
  try {
    const response = await req.client.getUnreadMessages(false, false, true);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', response: 'Error on open list', error: e });
  }
}

async function getChatIsOnline(req, res) {
  const { phone } = req.params;
  try {
    const response = await req.client.getChatIsOnline(`${phone}@c.us`);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', response: 'Error on get chat is online', error: e });
  }
}

async function getLastSeen(req, res) {
  const { phone } = req.params;
  try {
    const response = await req.client.getLastSeen(`${phone}@c.us`);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', response: 'Error on get chat last seen', error: error });
  }
}

async function getListMutes(req, res) {
  const { type = 'all' } = req.params;
  try {
    const response = await req.client.getListMutes(type);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', response: 'Error on get list mutes', error: error });
  }
}

async function loadAndGetAllMessagesInChat(req, res) {
  const { phone, includeMe = true, includeNotifications = false } = req.params;
  try {
    const response = await req.client.loadAndGetAllMessagesInChat(`${phone}@c.us`, includeMe, includeNotifications);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', response: 'Error on open list', error: error });
  }
}
async function getMessages(req, res) {
  const { phone } = req.params;
  const { count = 20, direction = 'before', id = null } = req.query;
  try {
    const response = await req.client.getMessages(`${phone}`, {
      count: parseInt(count),
      direction: direction.toString(),
      id: id
    });
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(401).json({ status: 'error', response: 'Error on open list', error: e });
  }
}

async function sendContactVcard(req, res) {
  const { phone, contactsId, name = null, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.sendContactVcard(`${contato}`, contactsId, name);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on send contact vcard', error: error });
  }
}

async function sendMute(req, res) {
  const { phone, time, type = 'hours', isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.sendMute(`${contato}`, time, type);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on send mute', error: error });
  }
}

async function sendSeen(req, res) {
  const { phone } = req.body;
  const session = req.session;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client.sendSeen(contato));
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function setChatState(req, res) {
  const { phone, chatstate, isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.setChatState(`${contato}`, chatstate);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on send chat state', error: error });
  }
}

async function setTemporaryMessages(req, res) {
  const { phone, value = true, isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.setTemporaryMessages(`${contato}`, value);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on set temporary messages', error: error });
  }
}

async function setTyping(req, res) {
  const { phone, value = true, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      if (value) response = await req.client.startTyping(contato);else
      response = await req.client.stopTyping(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on set typing', error: error });
  }
}

async function setRecording(req, res) {
  const { phone, value = true, duration, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      if (value) response = await req.client.startRecording(contato, duration);else
      response = await req.client.stopRecoring(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on set recording', error: error });
  }
}

async function checkNumberStatus(req, res) {
  const { phone } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.checkNumberStatus(`${contato}`);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on check number status', error: error });
  }
}

async function getContact(req, res) {
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getContact(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on get contact', error: error });
  }
}

async function getAllContacts(req, res) {
  try {
    const response = await req.client.getAllContacts();

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on get all constacts', error: error });
  }
}

async function getNumberProfile(req, res) {
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getNumberProfile(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on get number profile', error: error });
  }
}

async function getProfilePicFromServer(req, res) {
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getProfilePicFromServer(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on  get profile pic', error: error });
  }
}

async function getStatus(req, res) {
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getStatus(contato);
    }
    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on  get status', error: error });
  }
}

async function setProfileStatus(req, res) {
  const { status } = req.body;
  try {
    let response = await req.client.setProfileStatus(status);

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on set profile status' });
  }
}
async function rejectCall(req, res) {
  const { callId } = req.body;
  try {
    let response = await req.client.rejectCall(callId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ status: 'error', message: 'Error on rejectCall', error: e });
  }
}

async function starMessage(req, res) {
  const { messageId, star = true } = req.body;
  try {
    let response = await req.client.starMessage(messageId, star);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on  start message', error: error });
  }
}

async function getReactions(req, res) {
  const messageId = req.params.id;
  try {
    let response = await req.client.getReactions(messageId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on get reactions', error: error });
  }
}

async function getVotes(req, res) {
  const messageId = req.params.id;
  try {
    let response = await req.client.getVotes(messageId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on get votes', error: error });
  }
}
async function chatWoot(req, res) {
  const { session } = req.params;
  const client = _sessionUtil.clientsArray[session];
  if (client == null || client.status !== 'CONNECTED') return;
  try {
    if (await client.isConnected()) {
      const event = req.body.event;

      if (event == 'conversation_status_changed' || event == 'conversation_resolved' || req.body.private) {
        return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' });
      }

      const {
        message_type,
        phone = req.body.conversation.meta.sender.phone_number.replace('+', ''),
        message = req.body.conversation.messages[0]
      } = req.body;

      if (event != 'message_created' && message_type != 'outgoing') return res.status(200);
      for (const contato of (0, _functions.contactToArray)(phone, false)) {
        if (message_type == 'outgoing') {
          if (message.attachments) {
            let base_url = `${client.config.chatWoot.baseURL}/${message.attachments[0].data_url.substring(
            message.attachments[0].data_url.indexOf('/rails/') + 1)
            }`;
            await client.sendFile(`${contato}`, base_url, 'file', message.content);
          } else {
            await client.sendText(contato, message.content);
          }
        }
      }
      return res.status(200).json({ status: 'success', message: 'Success on  receive chatwoot' });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 'error', message: 'Error on  receive chatwoot', error: e });
  }
}
//# sourceMappingURL=deviceController.js.map