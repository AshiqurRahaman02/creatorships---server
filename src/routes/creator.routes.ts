import { Router } from "express";
import {
	createCreator,
	updateCreator,
	getCreator,
	deleteCreator,
	getAllCreators,
	searchCreators,
} from "../controllers/creator.controller";
import { verifyToken } from "../middlewares/authentication.middlewares";

const creatorRouter = Router();

creatorRouter.post("/create",verifyToken, createCreator);
creatorRouter.put("/update",verifyToken, updateCreator);
creatorRouter.delete("/delete",verifyToken, deleteCreator);

creatorRouter.get("/get-creator/:userId", getCreator);
creatorRouter.get("/get-all-creators", getAllCreators);
creatorRouter.get("/search-creators", searchCreators);

export default creatorRouter;
