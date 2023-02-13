"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;














var _express = require("express");
var _encryptController = require("../controller/encryptController");
var CatalogController = _interopRequireWildcard(require("../controller/catalogController"));
var MessageController = _interopRequireWildcard(require("../controller/messageController"));
var StatusController = _interopRequireWildcard(require("../controller/statusController"));
var LabelsController = _interopRequireWildcard(require("../controller/labelsController"));
var GroupController = _interopRequireWildcard(require("../controller/groupController"));
var DeviceController = _interopRequireWildcard(require("../controller/deviceController"));
var SessionController = _interopRequireWildcard(require("../controller/sessionController"));
var OrderController = _interopRequireWildcard(require("../controller/orderController"));
var HealthCheck = _interopRequireWildcard(require("../middleware/healthCheck"));
var _auth = _interopRequireDefault(require("../middleware/auth"));
var _statusConnection = _interopRequireDefault(require("../middleware/statusConnection"));
var _multer = _interopRequireDefault(require("multer"));
var _upload = _interopRequireDefault(require("../config/upload"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swagger = _interopRequireDefault(require("../swagger.json"));function _getRequireWildcardCache(nodeInterop) {if (typeof WeakMap !== "function") return null;var cacheBabelInterop = new WeakMap();var cacheNodeInterop = new WeakMap();return (_getRequireWildcardCache = function (nodeInterop) {return nodeInterop ? cacheNodeInterop : cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj, nodeInterop) {if (!nodeInterop && obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache(nodeInterop);if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;} /*
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
 */const upload = (0, _multer.default)(_upload.default);const routes = new _express.Router(); // Generate Token
routes.post('/api/:session/:secretkey/generate-token', _encryptController.encryptSession); // All Sessions
routes.get('/api/:secretkey/show-all-sessions', SessionController.showAllSessions);routes.post('/api/:secretkey/start-all', SessionController.startAllSessions); // Sessions
routes.get('/api/:session/check-connection-session', _auth.default, SessionController.checkConnectionSession);routes.get('/api/:session/get-media-by-message/:messageId', _auth.default, SessionController.getMediaByMessage);routes.get('/api/:session/status-session', _auth.default, SessionController.getSessionState);routes.get('/api/:session/qrcode-session', _auth.default, SessionController.getQrCode);routes.post('/api/:session/start-session', _auth.default, SessionController.startSession);
routes.post('/api/:session/logout-session', _auth.default, _statusConnection.default, SessionController.logOutSession);
routes.post('/api/:session/close-session', _auth.default, SessionController.closeSession);
routes.post('/api/:session/subscribe-presence', _auth.default, SessionController.subscribePresence);
routes.post('/api/:session/download-media', _auth.default, _statusConnection.default, SessionController.downloadMediaByMessage);
routes.post('/api/:session/kill-service-workier', _auth.default, _statusConnection.default, SessionController.killServiceWorker);
routes.post('/api/:session/restart-service', _auth.default, _statusConnection.default, SessionController.restartService);

// Messages
routes.post('/api/:session/send-message', _auth.default, _statusConnection.default, MessageController.sendMessage);
routes.post(
'/api/:session/send-image',
upload.single('file'),
_auth.default,
_statusConnection.default,
MessageController.sendFile);

routes.post(
'/api/:session/send-sticker',
upload.single('file'),
_auth.default,
_statusConnection.default,
MessageController.sendImageAsSticker);

routes.post(
'/api/:session/send-sticker-gif',
upload.single('file'),
_auth.default,
_statusConnection.default,
MessageController.sendImageAsStickerGif);

routes.post('/api/:session/send-reply', _auth.default, _statusConnection.default, MessageController.replyMessage);
routes.post(
'/api/:session/send-file',
upload.single('file'),
_auth.default,
_statusConnection.default,
MessageController.sendFile);

routes.post('/api/:session/send-file-base64', _auth.default, _statusConnection.default, MessageController.sendFile);
routes.post('/api/:session/send-voice', _auth.default, _statusConnection.default, MessageController.sendVoice);
routes.post('/api/:session/send-voice-base64', _auth.default, _statusConnection.default, MessageController.sendVoice64);
routes.post('/api/:session/send-status', _auth.default, _statusConnection.default, MessageController.sendStatusText);
routes.post('/api/:session/send-link-preview', _auth.default, _statusConnection.default, MessageController.sendLinkPreview);
routes.post('/api/:session/send-location', _auth.default, _statusConnection.default, MessageController.sendLocation);
routes.post('/api/:session/send-mentioned', _auth.default, _statusConnection.default, MessageController.sendMentioned);
routes.post('/api/:session/send-buttons', _auth.default, _statusConnection.default, MessageController.sendButtons);
routes.post('/api/:session/send-list-message', _auth.default, _statusConnection.default, MessageController.sendListMessage);
routes.post('/api/:session/send-poll-message', _auth.default, _statusConnection.default, MessageController.sendPollMessage);

// Group
routes.get('/api/:session/all-broadcast-list', _auth.default, _statusConnection.default, GroupController.getAllBroadcastList);
routes.get('/api/:session/all-groups', _auth.default, _statusConnection.default, GroupController.getAllGroups);
routes.get('/api/:session/group-members/:groupId', _auth.default, _statusConnection.default, GroupController.getGroupMembers);
routes.get('/api/:session/group-admins/:groupId', _auth.default, _statusConnection.default, GroupController.getGroupAdmins);
routes.get(
'/api/:session/group-invite-link/:groupId',
_auth.default,
_statusConnection.default,
GroupController.getGroupInviteLink);

routes.get(
'/api/:session/group-revoke-link/:groupId',
_auth.default,
_statusConnection.default,
GroupController.revokeGroupInviteLink);

routes.get(
'/api/:session/group-members-ids/:groupId',
_auth.default,
_statusConnection.default,
GroupController.getGroupMembersIds);

routes.post('/api/:session/create-group', _auth.default, _statusConnection.default, GroupController.createGroup);
routes.post('/api/:session/leave-group', _auth.default, _statusConnection.default, GroupController.leaveGroup);
routes.post('/api/:session/join-code', _auth.default, _statusConnection.default, GroupController.joinGroupByCode);
routes.post('/api/:session/add-participant-group', _auth.default, _statusConnection.default, GroupController.addParticipant);
routes.post('/api/:session/remove-participant-group', _auth.default, _statusConnection.default, GroupController.removeParticipant);
routes.post(
'/api/:session/promote-participant-group',
_auth.default,
_statusConnection.default,
GroupController.promoteParticipant);

routes.post('/api/:session/demote-participant-group', _auth.default, _statusConnection.default, GroupController.demoteParticipant);
routes.post(
'/api/:session/group-info-from-invite-link',
_auth.default,
_statusConnection.default,
GroupController.getGroupInfoFromInviteLink);

routes.post('/api/:session/group-description', _auth.default, _statusConnection.default, GroupController.setGroupDescription);
routes.post('/api/:session/group-property', _auth.default, _statusConnection.default, GroupController.setGroupProperty);
routes.post('/api/:session/group-subject', _auth.default, _statusConnection.default, GroupController.setGroupSubject);
routes.post('/api/:session/messages-admins-only', _auth.default, _statusConnection.default, GroupController.setMessagesAdminsOnly);
routes.post(
'/api/:session/group-pic',
upload.single('file'),
_auth.default,
_statusConnection.default,
GroupController.setGroupProfilePic);

routes.post('/api/:session/change-privacy-group', _auth.default, _statusConnection.default, GroupController.changePrivacyGroup);

// Chat
routes.get('/api/:session/all-chats', _auth.default, _statusConnection.default, DeviceController.getAllChats);
routes.get(
'/api/:session/all-chats-with-messages',
_auth.default,
_statusConnection.default,
DeviceController.getAllChatsWithMessages);

routes.get(
'/api/:session/all-messages-in-chat/:phone',
_auth.default,
_statusConnection.default,
DeviceController.getAllMessagesInChat);

routes.get('/api/:session/all-new-messages', _auth.default, _statusConnection.default, DeviceController.getAllNewMessages);
routes.get('/api/:session/unread-messages', _auth.default, _statusConnection.default, DeviceController.getUnreadMessages);
routes.get('/api/:session/all-unread-messages', _auth.default, _statusConnection.default, DeviceController.getAllUnreadMessages);
routes.get('/api/:session/chat-by-id/:phone', _auth.default, _statusConnection.default, DeviceController.getChatById);
routes.get('/api/:session/message-by-id/:messageId', _auth.default, _statusConnection.default, DeviceController.getMessageById);
routes.get('/api/:session/chat-is-online/:phone', _auth.default, _statusConnection.default, DeviceController.getChatIsOnline);
routes.get('/api/:session/last-seen/:phone', _auth.default, _statusConnection.default, DeviceController.getLastSeen);
routes.get('/api/:session/list-mutes/:type', _auth.default, _statusConnection.default, DeviceController.getListMutes);
routes.get(
'/api/:session/load-messages-in-chat/:phone',
_auth.default,
_statusConnection.default,
DeviceController.loadAndGetAllMessagesInChat);

routes.get('/api/:session/get-messages/:phone', _auth.default, _statusConnection.default, DeviceController.getMessages);

routes.post('/api/:session/archive-chat', _auth.default, _statusConnection.default, DeviceController.archiveChat);
routes.post('/api/:session/archive-all-chats', _auth.default, _statusConnection.default, DeviceController.archiveAllChats);
routes.post('/api/:session/clear-chat', _auth.default, _statusConnection.default, DeviceController.clearChat);
routes.post('/api/:session/clear-all-chats', _auth.default, _statusConnection.default, DeviceController.clearAllChats);
routes.post('/api/:session/delete-chat', _auth.default, _statusConnection.default, DeviceController.deleteChat);
routes.post('/api/:session/delete-all-chats', _auth.default, _statusConnection.default, DeviceController.deleteAllChats);
routes.post('/api/:session/delete-message', _auth.default, _statusConnection.default, DeviceController.deleteMessage);
routes.post('/api/:session/react-message', _auth.default, _statusConnection.default, DeviceController.reactMessage);
routes.post('/api/:session/forward-messages', _auth.default, _statusConnection.default, DeviceController.forwardMessages);
routes.post('/api/:session/mark-unseen', _auth.default, _statusConnection.default, DeviceController.markUnseenMessage);
routes.post('/api/:session/pin-chat', _auth.default, _statusConnection.default, DeviceController.pinChat);
routes.post('/api/:session/contact-vcard', _auth.default, _statusConnection.default, DeviceController.sendContactVcard);
routes.post('/api/:session/send-mute', _auth.default, _statusConnection.default, DeviceController.sendMute);
routes.post('/api/:session/send-seen', _auth.default, _statusConnection.default, DeviceController.sendSeen);
routes.post('/api/:session/chat-state', _auth.default, _statusConnection.default, DeviceController.setChatState);
routes.post('/api/:session/temporary-messages', _auth.default, _statusConnection.default, DeviceController.setTemporaryMessages);
routes.post('/api/:session/typing', _auth.default, _statusConnection.default, DeviceController.setTyping);
routes.post('/api/:session/recording', _auth.default, _statusConnection.default, DeviceController.setRecording);
routes.post('/api/:session/star-message', _auth.default, _statusConnection.default, DeviceController.starMessage);
routes.get('/api/:session/reactions/:id', _auth.default, _statusConnection.default, DeviceController.getReactions);
routes.get('/api/:session/votes/:id', _auth.default, _statusConnection.default, DeviceController.getVotes);
routes.post('/api/:session/reject-call', _auth.default, _statusConnection.default, DeviceController.rejectCall);

// Catalog
routes.get('/api/:session/get-products', _auth.default, _statusConnection.default, CatalogController.getProducts);
routes.get('/api/:session/get-product-by-id', _auth.default, _statusConnection.default, CatalogController.getProductById);
routes.post('/api/:session/edit-product', _auth.default, _statusConnection.default, CatalogController.editProduct);
routes.post('/api/:session/del-products', _auth.default, _statusConnection.default, CatalogController.delProducts);
routes.post('/api/:session/change-product-image', _auth.default, _statusConnection.default, CatalogController.changeProductImage);
routes.post('/api/:session/add-product-image', _auth.default, _statusConnection.default, CatalogController.addProductImage);
routes.post('/api/:session/remove-product-image', _auth.default, _statusConnection.default, CatalogController.removeProductImage);
routes.get('/api/:session/get-collections', _auth.default, _statusConnection.default, CatalogController.getCollections);
routes.post('/api/:session/create-collection', _auth.default, _statusConnection.default, CatalogController.createCollection);
routes.post('/api/:session/edit-collection', _auth.default, _statusConnection.default, CatalogController.editCollection);
routes.post('/api/:session/del-collection', _auth.default, _statusConnection.default, CatalogController.deleteCollection);
routes.post('/api/:session/send-link-catalog', _auth.default, _statusConnection.default, CatalogController.sendLinkCatalog);
routes.post(
'/api/:session/set-product-visibility',
_auth.default,
_statusConnection.default,
CatalogController.setProductVisibility);

routes.post('/api/:session/set-cart-enabled', _auth.default, _statusConnection.default, CatalogController.updateCartEnabled);

// Status
routes.post('/api/:session/send-text-storie', _auth.default, _statusConnection.default, StatusController.sendTextStorie);
routes.post(
'/api/:session/send-image-storie',
upload.single('file'),
_auth.default,
_statusConnection.default,
StatusController.sendImageStorie);

routes.post(
'/api/:session/send-video-storie',
upload.single('file'),
_auth.default,
_statusConnection.default,
StatusController.sendVideoStorie);


// Labels
routes.post('/api/:session/add-new-label', _auth.default, _statusConnection.default, LabelsController.addNewLabel);
routes.post('/api/:session/add-or-remove-label', _auth.default, _statusConnection.default, LabelsController.addOrRemoveLabels);
routes.get('/api/:session/get-all-labels', _auth.default, _statusConnection.default, LabelsController.getAllLabels);
routes.put('/api/:session/delete-all-labels', _auth.default, _statusConnection.default, LabelsController.deleteAllLabels);
routes.put('/api/:session/delete-label/:id', _auth.default, _statusConnection.default, LabelsController.deleteLabel);

// Contact
routes.get(
'/api/:session/check-number-status/:phone',
_auth.default,
_statusConnection.default,
DeviceController.checkNumberStatus);

routes.get('/api/:session/all-contacts', _auth.default, _statusConnection.default, DeviceController.getAllContacts);
routes.get('/api/:session/contact/:phone', _auth.default, _statusConnection.default, DeviceController.getContact);
routes.get('/api/:session/profile/:phone', _auth.default, _statusConnection.default, DeviceController.getNumberProfile);
routes.get('/api/:session/profile-pic/:phone', _auth.default, _statusConnection.default, DeviceController.getProfilePicFromServer);
routes.get('/api/:session/profile-status/:phone', _auth.default, _statusConnection.default, DeviceController.getStatus);

// Blocklist
routes.get('/api/:session/blocklist', _auth.default, _statusConnection.default, DeviceController.getBlockList);
routes.post('/api/:session/block-contact', _auth.default, _statusConnection.default, DeviceController.blockContact);
routes.post('/api/:session/unblock-contact', _auth.default, _statusConnection.default, DeviceController.unblockContact);

// Device
routes.get('/api/:session/get-battery-level', _auth.default, _statusConnection.default, DeviceController.getBatteryLevel);
routes.get('/api/:session/host-device', _auth.default, _statusConnection.default, DeviceController.getHostDevice);
routes.get('/api/:session/get-phone-number', _auth.default, _statusConnection.default, DeviceController.getPhoneNumber);

// Profile
routes.post(
'/api/:session/set-profile-pic',
upload.single('file'),
_auth.default,
_statusConnection.default,
DeviceController.setProfilePic);

routes.post('/api/:session/profile-status', _auth.default, _statusConnection.default, DeviceController.setProfileStatus);
routes.post('/api/:session/change-username', _auth.default, _statusConnection.default, DeviceController.setProfileName);

// Business
routes.get(
'/api/:session/get-business-profiles-products',
_auth.default,
_statusConnection.default,
OrderController.getBusinessProfilesProducts);

routes.get('/api/:session/get-order-by-messageId', _auth.default, _statusConnection.default, OrderController.getOrderbyMsg);

routes.post('/api/:session/chatwoot', DeviceController.chatWoot);

// Api Doc
routes.use('/api-docs', _swaggerUiExpress.default.serve);
routes.get('/api-docs', _swaggerUiExpress.default.setup(_swagger.default));

//k8s
routes.get('/healthz', HealthCheck.healthz);
routes.get('/unhealthy', HealthCheck.unhealthy);var _default =

routes;exports.default = _default;
//# sourceMappingURL=index.js.map