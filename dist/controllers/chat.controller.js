"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChats = exports.deleteChat = exports.blockChat = exports.sendChat = void 0;
const sequelize_1 = require("sequelize");
const chat_model_1 = __importDefault(require("../models/chat.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Sends a chat message between users.
 *
 * @param {Request} req - The request object containing chat details in `req.body`.
 * @param {number} [req.user.user_id] - The ID of the sender. Required in the request.
 * @param {number} [req.body.receiver_id ] - The ID of the receiver. Required in the request.
 * @param {object} [req.body.chat] - The chat message details.
 * @param {string} [req.body.chat.message] - The message content. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the chat operation.
 */
const sendChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receiver_id, chat } = req.body;
    try {
        const sender_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!sender_id) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        if (sender_id === receiver_id) {
            res.status(400).json({
                isError: true,
                message: "Sender and receiver can't be the same",
            });
            return;
        }
        if (!chat.message) {
            res.status(400).json({
                isError: true,
                message: "Chat must include a message",
            });
            return;
        }
        const user = yield user_model_1.default.findOne({
            where: { user_id: receiver_id },
            attributes: ["user_id", "name", "email", "logo", "type", "verified"],
        });
        if (!user) {
            res.status(404).json({
                isError: true,
                message: "Receiver not found",
            });
            return;
        }
        chat.date = new Date();
        chat.sender_id = sender_id;
        chat.read = false;
        // Check if a chat between the two users already exists
        const existingChat = yield chat_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { sender_id: sender_id, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id },
                ],
            },
        });
        if (existingChat) {
            // If chat exists, update it
            const updatedChats = [...existingChat.chats, chat];
            const [updated] = yield chat_model_1.default.update({ chats: updatedChats }, { where: { id: existingChat.id } });
            if (!updated) {
                res.status(400).json({
                    isError: true,
                    message: "Failed to send chat",
                });
                return;
            }
        }
        else {
            // If chat does not exist, create a new one
            const newChat = yield chat_model_1.default.create({
                sender_id,
                receiver_id,
                chats: [chat],
            });
        }
        const chats = yield findAllChats(sender_id);
        res.status(200).json({ isError: false, chats });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.sendChat = sendChat;
/**
 * Blocks a chat.
 *
 * @param {Request} req - The request object containing chat ID in `req.params`.
 * @param {number} [req.user.user_id] - The ID of the user blocking the chat. Required in the request.
 * @param {number} [req.params.id] - The ID of the chat to be blocked. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the block operation.
 */
const blockChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        const existingChat = yield chat_model_1.default.findByPk(id);
        if (!existingChat) {
            res.status(404).json({
                isError: true,
                message: "Chat not found",
            });
            return;
        }
        const updated = yield chat_model_1.default.update({ blockedBy: userId }, { where: { id } });
        res.status(200).json({
            isError: false,
            message: "Chat blocked successfully",
            chat: updated,
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.blockChat = blockChat;
/**
 * Deletes a chat.
 *
 * @param {Request} req - The request object containing chat ID in `req.params`.
 * @param {number} [req.params.id] - The ID of the chat to be deleted. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the delete operation.
 */
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedChat = yield chat_model_1.default.destroy({ where: { id } });
        if (!deletedChat) {
            res.status(404).json({
                isError: true,
                message: "Chat not found",
            });
            return;
        }
        res.status(200).json({ isError: false, message: "Chat deleted" });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.deleteChat = deleteChat;
/**
 * Retrieves all chats for a user.
 *
 * @param {Request} req - The request object.
 * @param {number} [req.user.user_id] - The ID of the user requesting their chats. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with all chats for the user.
 */
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!user_id) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        const chats = yield findAllChats(user_id);
        res.status(200).json({ isError: false, chats });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getAllChats = getAllChats;
/**
 * Finds all chats for a given user ID.
 *
 * @param {number} user_id - The ID of the user whose chats are to be retrieved.
 * @returns {Promise<Chat[]>} - A promise that resolves to an array of chat objects.
 */
const findAllChats = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return chat_model_1.default.findAll({
        where: {
            [sequelize_1.Op.or]: [{ sender_id: user_id }, { receiver_id: user_id }],
        },
        include: [
            {
                model: user_model_1.default,
                as: "sender",
                attributes: ["user_id", "name", "logo", "type", "verified"],
            },
            {
                model: user_model_1.default,
                as: "receiver",
                attributes: ["user_id", "name", "logo", "type", "verified"],
            },
        ],
    });
});
