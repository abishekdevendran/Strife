import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import User, { Tuser } from '../models/User';

export default async function loginController(req: Request, res: Response) {
  const { username, password } = req.body;
  const clientSecret = process.env.COUPLING_SECRET;
  //unhash password from client
  const unhashedPassword = CryptoJS.AES.decrypt(
    password,
    clientSecret!
  ).toString(CryptoJS.enc.Utf8);
  //get hashed password from database
  try{
    const user= await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = user.password;
    //compare passwords using sha256
    const passwordsMatch =
      CryptoJS.SHA256(unhashedPassword).toString(CryptoJS.enc.Base64) ===
      hashedPassword;
    if (!passwordsMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    //set session
    req.session.user = (user as Tuser);
    return res.status(200).json({ message: 'Login successful' });
  }catch(err){
    return res.status(500).json({ message: 'Internal server error' });
  }
}