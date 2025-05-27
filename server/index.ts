import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeChallenges, assignRandomChallenges } from "./challengeUtils";
import { config } from 'dotenv';
import { checkDatabaseConnection } from './db';

// Load environment variables from .env file
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add headers to allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

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

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

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