import { Request, Response } from "express";
import { Op } from "sequelize";
import Chat from "../models/chat.model";
import User from "../models/user.model";

// Send Chat
export const sendChat = async (req: Request, res: Response) => {
	const { receiver_id, chat } = req.body;
  
	try {
	  const sender_id = req.user?.user_id;
  
	  if (!sender_id) {
		return res.status(500).json({
		  isError: true,
		  message: "Internal Server Error",
		});
	  }
  
	  // Check if a chat between the two users already exists
	  let existingChat = await Chat.findOne({
		where: {
		  [Op.or]: [
			{ sender_id: sender_id, receiver_id: receiver_id },
			{ sender_id: receiver_id, receiver_id: sender_id }
		  ]
		}
	  });
  
	  if (existingChat) {
		// If chat exists, update it
		const updatedChats = [...existingChat.chats, chat];
  
		const [updated] = await Chat.update(
		  { chats: updatedChats },
		  { where: { id: existingChat.id } }
		);
  
		if (updated) {
		  existingChat = await Chat.findByPk(existingChat.id);
		  return res.status(200).json({
			isError: false,
			message: "Chat updated",
			chat: existingChat,
		  });
		} else {
		  return res.status(400).json({
			isError: true,
			message: "Failed to update chat",
		  });
		}
	  } else {
		// If chat does not exist, create a new one
		const newChat = await Chat.create({
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
	} catch (error: any) {
	  res.status(500).json({ isError: true, message: error.message });
	}
  };

export const blockChat = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const existingChat = await Chat.findByPk(id);

		if (!existingChat) {
			return res
				.status(404)
				.json({ isError: true, message: "Chat not found" });
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
// Delete Chat
export const deleteChat = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const deletedChat = await Chat.destroy({ where: { id } });

		if (!deletedChat) {
			return res
				.status(404)
				.json({ isError: true, message: "Chat not found" });
		}

		res.status(200).json({ isError: false, message: "Chat deleted" });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Get All Chats for a User
export const getAllChats = async (req: Request, res: Response) => {
	try {
	  const user_id = req.user?.user_id;
  
	  if (!user_id) {
		return res.status(500).json({
		  isError: true,
		  message: "Internal Server Error",
		});
	  }
  
	  const chats = await Chat.findAll({
		where: {
		  [Op.or]: [
			{ sender_id: user_id },
			{ receiver_id: user_id }
		  ]
		},
		include: [
		  {
			model: User,
			as: "sender",
			attributes: ["user_id", "name", "email"],
		  },
		  {
			model: User,
			as: "receiver",
			attributes: ["user_id", "name", "email"],
		  },
		],
	  });
  
	  res.status(200).json({ isError: false, chats });
	} catch (error: any) {
	  res.status(500).json({ isError: true, message: error.message });
	}
  };
