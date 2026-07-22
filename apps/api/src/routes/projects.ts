import { Router } from "express";
import { projectController } from "../controllers/projectController.js";

export const projectRouter = Router();

projectRouter.get("/", projectController.list);
projectRouter.get("/:id", projectController.get);
projectRouter.post("/", projectController.create);
projectRouter.put("/:id", projectController.update);
projectRouter.delete("/:id", projectController.delete);
