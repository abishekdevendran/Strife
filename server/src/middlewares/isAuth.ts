import { NextFunction, Request, Response } from "express";

export default function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}