import { Router } from "express";
import { createApplication, deleteApplication, getAllApplications, getApplication, getUserApplications, searchApplications, updateApplication } from "../controllers/application.controller";
import { verifyToken } from "../middlewares/authentication.middlewares";

const applicationRouter = Router();

applicationRouter.post("/create",verifyToken, createApplication);
applicationRouter.put("/update/:id",verifyToken, updateApplication);
applicationRouter.delete("/delete/:id",verifyToken, deleteApplication);

applicationRouter.get("/get-user-applications",verifyToken, getUserApplications);
applicationRouter.get("/get-application/:id", getApplication);
applicationRouter.get("/get-all-applications", getAllApplications);
applicationRouter.get("/search-applications", searchApplications);

export default applicationRouter;
