import { Request, Response } from 'express';

export const projectController = {
  async list(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async get(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async create(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async update(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  },
  async delete(req: Request, res: Response) {
    res.status(501).json({ error: 'Not implemented for Drizzle yet' });
  }
};
