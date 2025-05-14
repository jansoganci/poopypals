import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkChallengeProgress, assignRandomChallenges } from "./challengeUtils";

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
      
      // Default to user ID 1 for demo purposes
      const userId = 1;
      
      // Check and update existing challenge progress
      await checkChallengeProgress(userId);
      
      // Randomly assign new challenges if needed
      await assignRandomChallenges(userId);
      
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error creating log:', error);
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

  // API routes for challenges
  app.get('/api/challenges', async (req, res) => {
    try {
      const challenges = await storage.getActiveGlobalChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get challenges' });
    }
  });

  app.post('/api/challenges', async (req, res) => {
    try {
      const newChallenge = await storage.createChallenge(req.body);
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create challenge' });
    }
  });

  // API routes for user challenges
  app.get('/api/user-challenges', async (req, res) => {
    try {
      // Default to user ID 1 for demo
      const userId = 1;
      const userChallenges = await storage.getUserActiveChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user challenges' });
    }
  });

  app.post('/api/user-challenges/assign', async (req, res) => {
    try {
      const { challengeId } = req.body;
      // Default to user ID 1 for demo
      const userId = 1;
      const userChallenge = await storage.assignChallengeToUser(userId, challengeId);
      res.status(201).json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to assign challenge' });
    }
  });

  app.put('/api/user-challenges/:id/progress', async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userChallenge = await storage.updateUserChallengeProgress(Number(id), progress);
      res.json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update challenge progress' });
    }
  });

  app.put('/api/user-challenges/:id/complete', async (req, res) => {
    try {
      const { id } = req.params;
      const userChallenge = await storage.completeUserChallenge(Number(id));
      res.json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete challenge' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
