import { Request, Response } from "express";
import { Op } from "sequelize";
import Chat from "../models/chat.model";
import User from "../models/user.model";

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
export const sendChat = async (req: Request, res: Response): Promise<void> => {
	const { receiver_id, chat } = req.body;

	try {
		const sender_id = req.user?.user_id;

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

		const user = await User.findOne({
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
		const existingChat = await Chat.findOne({
			where: {
				[Op.or]: [
					{ sender_id: sender_id, receiver_id: receiver_id },
					{ sender_id: receiver_id, receiver_id: sender_id },
				],
			},
		});

		if (existingChat) {
			// If chat exists, update it
			const updatedChats = [...existingChat.chats, chat];
			const [updated] = await Chat.update(
				{ chats: updatedChats },
				{ where: { id: existingChat.id } }
			);

			if (!updated) {
				res.status(400).json({
					isError: true,
					message: "Failed to send chat",
				});
				return;
			}
		} else {
			// If chat does not exist, create a new one
			const newChat = await Chat.create({
				sender_id,
				receiver_id,
				chats: [chat],
			});
		}

		const chats = await findAllChats(sender_id);

		res.status(200).json({ isError: false, chats });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Blocks a chat.
 *
 * @param {Request} req - The request object containing chat ID in `req.params`.
 * @param {number} [req.user.user_id] - The ID of the user blocking the chat. Required in the request.
 * @param {number} [req.params.id] - The ID of the chat to be blocked. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the block operation.
 */
export const blockChat = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		const existingChat = await Chat.findByPk(id);

		if (!existingChat) {
			res.status(404).json({
				isError: true,
				message: "Chat not found",
			});
			return;
		}

		const updated = await Chat.update(
			{ blockedBy: userId },
			{ where: { id } }
		);

		res.status(200).json({
			isError: false,
			message: "Chat blocked successfully",
			chat: updated,
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Deletes a chat.
 *
 * @param {Request} req - The request object containing chat ID in `req.params`.
 * @param {number} [req.params.id] - The ID of the chat to be deleted. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the delete operation.
 */
export const deleteChat = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const deletedChat = await Chat.destroy({ where: { id } });

		if (!deletedChat) {
			res.status(404).json({
				isError: true,
				message: "Chat not found",
			});
			return;
		}

		res.status(200).json({ isError: false, message: "Chat deleted" });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Retrieves all chats for a user.
 *
 * @param {Request} req - The request object.
 * @param {number} [req.user.user_id] - The ID of the user requesting their chats. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with all chats for the user.
 */
export const getAllChats = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const user_id = req.user?.user_id;

		if (!user_id) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		const chats = await findAllChats(user_id);

		res.status(200).json({ isError: false, chats });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Finds all chats for a given user ID.
 *
 * @param {number} user_id - The ID of the user whose chats are to be retrieved.
 * @returns {Promise<Chat[]>} - A promise that resolves to an array of chat objects.
 */
const findAllChats = async (user_id: number) => {
	return Chat.findAll({
		where: {
			[Op.or]: [{ sender_id: user_id }, { receiver_id: user_id }],
		},
		include: [
			{
				model: User,
				as: "sender",
				attributes: ["user_id", "name", "logo", "type", "verified"],
			},
			{
				model: User,
				as: "receiver",
				attributes: ["user_id", "name", "logo", "type", "verified"],
			},
		],
	});
};
