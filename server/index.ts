import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeChallenges, assignRandomChallenges } from "./challengeUtils";
import { config } from 'dotenv';
import { checkDatabaseConnection } from './db';
import { errorHandler, requestLogger } from './middleware';

// Load environment variables from .env file
config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use(requestLogger);

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

(async () => {
  // Check database connection before starting the server
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.error('Failed to connect to database. Please check your DATABASE_URL configuration.');
    process.exit(1);
  }

  console.log('Successfully connected to database.');

  const server = await registerRoutes(app);

  // Error handling middleware - should be last
  app.use(errorHandler);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Initialize default challenges
    initializeChallenges().catch(err => {
      console.error('Failed to initialize challenges:', err);
    });
    
    // Assign a starter challenge to user 1 (demo user)
    setTimeout(async () => {
      try {
        const userId = 1;
        await assignRandomChallenges(userId);
        console.log("Assigned starter challenges to user 1");
      } catch (err) {
        console.error('Failed to assign starter challenges:', err);
      }
    }, 2000);
  });
})();