import { Router } from "express";
import { uploadImage } from "../controllers/image.controller";

const imageRouter = Router();

imageRouter.post("/upload", uploadImage);

export default imageRouter;
