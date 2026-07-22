import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

export const aiRouter = Router();

aiRouter.post('/prompt-pack', aiController.generatePromptPack);
aiRouter.post('/script', aiController.generateScript);
