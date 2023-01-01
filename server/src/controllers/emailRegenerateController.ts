import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User, { Tuser } from '../models/User';
import generateEmailToken from '../utils/generateEmailToken';

export default async function emailRegenerateController(
  req: Request,
  res: Response
) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'User not logged in' });
  }
  const data = await User.findOne({ email: req.session.user!.email });
  if (!data) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { status, message, expireAt } = await generateEmailToken(
    data as unknown as Tuser & Types.ObjectId
  );
  if (expireAt) {
    return res.status(status).json({ message, expireAt });
  }
  return res.status(status).json({ message });
}
