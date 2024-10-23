import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../utils/tokenBlacklist';

interface UserPayload {
  user: {
    id: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload['user'];
}

export default function (req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.header('token');
  
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return;
  }

  if (isBlacklisted(token)) {
    res.status(401).json({ msg: 'Token has been logged out' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
