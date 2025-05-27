import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import pgErrorCodes from 'pg-error-codes';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Error handler middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    details: err instanceof APIError ? err.details : undefined
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: validationError.details
    });
  }

  // Handle PostgreSQL errors
  if (err instanceof DatabaseError) {
    const pgError = {
      code: err.code,
      message: pgErrorCodes[err.code] || err.message,
      detail: err.detail
    };

    // Map common database errors to appropriate HTTP status codes
    switch (err.code) {
      case '23505': // unique_violation
        return res.status(409).json({
          status: 'error',
          code: 'DUPLICATE_ENTRY',
          message: 'Resource already exists',
          details: pgError
        });
      case '23503': // foreign_key_violation
        return res.status(400).json({
          status: 'error',
          code: 'INVALID_REFERENCE',
          message: 'Invalid reference to another resource',
          details: pgError
        });
      default:
        return res.status(500).json({
          status: 'error',
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
          details: process.env.NODE_ENV === 'development' ? pgError : undefined
        });
    }
  }

  // Handle custom API errors
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code || 'API_ERROR',
      message: err.message,
      details: err.details
    });
  }

  // Handle all other errors
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}