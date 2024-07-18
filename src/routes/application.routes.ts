import { Router } from "express";
import { createApplication, deleteApplication, getAllApplications, getApplication, searchApplications, updateApplication } from "../controllers/application.controller";

const applicationRouter = Router();

applicationRouter.post("/create", createApplication);
applicationRouter.put("/update/:id", updateApplication);
applicationRouter.delete("/delete/:id", deleteApplication);

applicationRouter.get("/get-application/:userId", getApplication);
applicationRouter.get("/get-all-application", getAllApplications);
applicationRouter.get("/search-application", searchApplications);

export default applicationRouter;
