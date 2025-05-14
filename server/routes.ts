import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for poop logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getAllPoopLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get logs' });
    }
  });

  app.post('/api/logs', async (req, res) => {
    try {
      const newLog = await storage.createPoopLog(req.body);
      res.status(201).json(newLog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create log' });
    }
  });

  // API routes for achievements
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get achievements' });
    }
  });

  app.post('/api/achievements', async (req, res) => {
    try {
      const newAchievement = await storage.createAchievement(req.body);
      res.status(201).json(newAchievement);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create achievement' });
    }
  });

  // API route for user stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
