import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import User, { Tuser } from '../models/User';

export default async function registerController(req: Request, res: Response) {
  const { username, password } = req.body;
  const clientSecret = process.env.COUPLING_SECRET;
  //unhash password from client
  const unhashedPassword = CryptoJS.AES.decrypt(
    password,
    clientSecret!
  ).toString(CryptoJS.enc.Utf8);
  try {
    const user = await User.findOne({ username });
    if (user) {
      //user already exists
      return res.status(409).json({ message: 'User already exists' });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(unhashedPassword, 10);
    //create user
    const newUser = new User({
      username,
      password: hashedPassword,
      email: '',
      createdAt: new Date().toISOString(),
      githubID: '',
      isVerified: false,
      isBanned: false
    });
    //save user
    const savedUser = await newUser.save();
    //set session
    req.session.user = savedUser as Tuser;
    console.log('session user:', req.session.user);
    return res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
