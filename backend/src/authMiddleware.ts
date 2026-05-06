import { Request, Response, NextFunction } from 'express';
import { supabase } from '../src/supabaseClient' 


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const rawUserNumber = req.headers["x-user-number"];
  const userNumber = Array.isArray(rawUserNumber) ? rawUserNumber[0] : rawUserNumber;

  console.debug('Auth middleware received user number header:', rawUserNumber);

  if (!userNumber || typeof userNumber !== 'string' || !userNumber.trim()) {
    return res.status(401).json({
      error: "Missing user number",
      received: rawUserNumber
    });
  }

  const normalizedUserNumber = userNumber.trim();

  // Look up the user in the users table
  const { data: userRow, error } = await supabase
    .from('users')
    .select('profile_id, groups')
    .eq('user_number', normalizedUserNumber)
    .single();

  if (error) {
    console.error('Auth lookup failed for user number:', normalizedUserNumber, error);
    return res.status(401).json({
      error: "Authentication lookup failed",
      userNumber: normalizedUserNumber,
      details: process.env.NODE_ENV === 'production' ? undefined : error.message || error
    });
  }

  if (!userRow) {
    console.warn('Unknown user number:', normalizedUserNumber);
    return res.status(401).json({
      error: "Unknown user",
      userNumber: normalizedUserNumber
    });
  }

  req.user = {
    id: userRow.profile_id,   // UUID for apis.owner_id
    groups: userRow.groups    // permissions
  };

  next();
};


export const requireCatalogueGroup = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.groups?.includes('api_catalogue_group')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        groups: string[];
      };
    }
  }
} 