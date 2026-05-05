import { Request, Response, NextFunction } from 'express';

// This middleware validates the user's auth token and attaches req.user
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In your real implementation, decode the JWT or Supabase session here
  // Example placeholder:
  // req.user = decodedUser;

  next();
};

// This middleware ensures the user belongs to the 'catalogue' group
export const requireCatalogueGroup = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.groups?.includes('catalogue')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
