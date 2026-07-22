import { Request, Response } from 'express';
import { db } from '@studio/database';

export const projectController = {
  async list(_req: Request, res: Response) {
    try {
      const allProjects = db.getProjects();
      return res.status(200).json({ success: true, data: allProjects });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  },

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
      }

      const proj = db.getProjectById(id);
      if (!proj) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      return res.status(200).json({ success: true, data: proj });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, description, productionStatus, qaStatus } = req.body;

      if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, error: 'Title is required and must be a string' });
      }

      const newProject = db.createProject(title, description, productionStatus, qaStatus);
      return res.status(201).json({ success: true, data: newProject });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, productionStatus, qaStatus } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
      }

      const existing = db.getProjectById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const updated = db.updateProject(id, { title, description, productionStatus, qaStatus });
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
      }

      const success = db.deleteProject(id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      return res.status(200).json({ success: true, message: 'Project deleted successfully', id });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  }
};
