import { Request, Response } from 'express';
import { AIProviderManager, PromptService, ScriptService } from '@studio/core';

const providerManager = new AIProviderManager();
const promptService = new PromptService(providerManager);
const scriptService = new ScriptService(providerManager);

export const aiController = {
  async generatePromptPack(req: Request, res: Response) {
    try {
      const { topic, tone, language, channelDnaId, preferredProvider } = req.body;

      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ success: false, error: 'Topic is required and must be a string' });
      }

      const promptPack = await promptService.generatePromptPack({
        topic,
        tone,
        language,
        channelDnaId,
        preferredProvider
      });

      return res.status(200).json({ success: true, data: promptPack });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  },

  async generateScript(req: Request, res: Response) {
    try {
      const { topic, tone, language, promptPack, preferredProvider } = req.body;

      let effectivePromptPack = promptPack;

      if (!effectivePromptPack) {
        if (!topic || typeof topic !== 'string') {
          return res.status(400).json({ success: false, error: 'Topic or promptPack is required' });
        }
        effectivePromptPack = await promptService.generatePromptPack({
          topic,
          tone,
          language,
          preferredProvider
        });
      }

      const scriptDocument = await scriptService.generateScript(effectivePromptPack);

      return res.status(200).json({ success: true, data: scriptDocument });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  }
};
