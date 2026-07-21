import { Router } from "express";
import { projectController } from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get("/", projectController.list);
projectRouter.get("/:id", projectController.get);
projectRouter.post("/", projectController.create);
projectRouter.put("/:id", projectController.update);
projectRouter.delete("/:id", projectController.delete);
