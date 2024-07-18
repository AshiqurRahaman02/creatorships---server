import { Router } from "express";
import { createBusiness, deleteBusiness, getAllBusiness, getBusiness, searchBusiness, updateBusiness } from "../controllers/business.controller";
import { verifyToken } from "../middlewares/authentication.middlewares";

const businessRouter = Router();

businessRouter.post("/create",verifyToken, createBusiness);
businessRouter.put("/update",verifyToken, updateBusiness);
businessRouter.delete("/delete",verifyToken, deleteBusiness);

businessRouter.get("/get-business/:userId", getBusiness);
businessRouter.get("/get-all-businesses", getAllBusiness);
businessRouter.get("/search-businesses", searchBusiness);

export default businessRouter;
