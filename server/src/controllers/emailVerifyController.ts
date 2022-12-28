import { Request, Response } from 'express';
import EmailToken from '../models/EmailToken';
import User, { Tuser } from '../models/User';

const emailVerifyController= async (req: Request, res: Response) => {
  const { token } = req.params;
  if(!req.session.user){
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findOne({ email: req.session.user!.email });
    const tokenFound = await EmailToken.findOne({ _userId: user!._id });
    if (!tokenFound) {
      return res.status(404).json({ message: 'Token not found' });
    }
    if (tokenFound.token !== token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (tokenFound.expireAt < new Date()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    user!.isVerified = true;
    await user!.save();
    //delete token
    await EmailToken.deleteOne({ _userId: user!._id });
    //update session
    req.session.user = user as Tuser;
    //send response
    return res.status(200).json({ message: 'Email verified' });
  }catch(err){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default emailVerifyController;