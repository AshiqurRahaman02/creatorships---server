import { Router } from "express";
import { uploadImage } from "../controllers/image.controller";
import { verifyToken } from "../middlewares/authentication.middlewares";

const imageRouter = Router();

imageRouter.post("/upload",verifyToken, uploadImage);

export default imageRouter;
