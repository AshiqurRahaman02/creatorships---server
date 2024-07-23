import { Router } from "express";
import { verifyToken } from "../middlewares/authentication.middlewares";
import { blockChat, deleteChat, getAllChats, sendChat } from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.post("/send-chat",verifyToken, sendChat);
chatRouter.put("/block-chat/:id",verifyToken, blockChat)
chatRouter.delete("/delete/:id",verifyToken, deleteChat);

chatRouter.get("/get-all-chats",verifyToken, getAllChats);

export default chatRouter;
