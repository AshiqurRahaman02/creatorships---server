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
// Send Chat
const sendChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receiver_id, chat } = req.body;
    try {
        const sender_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!sender_id) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        // Check if a chat between the two users already exists
        let existingChat = yield chat_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { sender_id: sender_id, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id }
                ]
            }
        });
        if (existingChat) {
            // If chat exists, update it
            const updatedChats = [...existingChat.chats, chat];
            const [updated] = yield chat_model_1.default.update({ chats: updatedChats }, { where: { id: existingChat.id } });
            if (updated) {
                existingChat = yield chat_model_1.default.findByPk(existingChat.id);
                return res.status(200).json({
                    isError: false,
                    message: "Chat updated",
                    chat: existingChat,
                });
            }
            else {
                return res.status(400).json({
                    isError: true,
                    message: "Failed to update chat",
                });
            }
        }
        else {
            // If chat does not exist, create a new one
            const newChat = yield chat_model_1.default.create({
                sender_id,
                receiver_id,
                chats: [chat],
            });
            return res.status(201).json({
                isError: false,
                message: "Chat created",
                chat: newChat,
            });
        }
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.sendChat = sendChat;
const blockChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const existingChat = yield chat_model_1.default.findByPk(id);
        if (!existingChat) {
            return res
                .status(404)
                .json({ isError: true, message: "Chat not found" });
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
// Delete Chat
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedChat = yield chat_model_1.default.destroy({ where: { id } });
        if (!deletedChat) {
            return res
                .status(404)
                .json({ isError: true, message: "Chat not found" });
        }
        res.status(200).json({ isError: false, message: "Chat deleted" });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.deleteChat = deleteChat;
// Get All Chats for a User
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!user_id) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const chats = yield chat_model_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { sender_id: user_id },
                    { receiver_id: user_id }
                ]
            },
            include: [
                {
                    model: user_model_1.default,
                    as: "sender",
                    attributes: ["user_id", "name", "email"],
                },
                {
                    model: user_model_1.default,
                    as: "receiver",
                    attributes: ["user_id", "name", "email"],
                },
            ],
        });
        res.status(200).json({ isError: false, chats });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getAllChats = getAllChats;
