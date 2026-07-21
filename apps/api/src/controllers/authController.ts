import { Request, Response } from 'express';

export const authController = {
  async register(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async login(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async profile(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async logout(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  }
};
