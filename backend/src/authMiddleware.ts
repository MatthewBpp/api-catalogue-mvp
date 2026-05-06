import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
const userNumber = req.headers["x-user-number"] as string;
  
if (!userNumber) {
  return res.status(400).json({ error: "Missing user number" });
}


  // Attach a fake user object for now
  req.user = {
    id: userNumber,
    groups: ['catalogue'] // allow create/update/delete
  };

  next();
};

export const requireCatalogueGroup = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.groups?.includes('catalogue')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
