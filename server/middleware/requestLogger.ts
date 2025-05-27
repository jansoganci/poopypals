import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log request body if present
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body));
  }

  // Capture response
  const oldSend = res.send;
  res.send = function(data) {
    // Log response
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    
    // Call original send
    return oldSend.call(this, data);
  };

  next();
}