import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import generateEmailToken from '../utils/generateEmailToken';
import User, { Tuser } from '../models/User';

export default async function registerController(req: Request, res: Response) {
  const { username, password, email } = req.body;
  const clientSecret = process.env.COUPLING_SECRET;
  //unhash password from client
  const unhashedPassword = CryptoJS.AES.decrypt(
    password,
    clientSecret!
  ).toString(CryptoJS.enc.Utf8);
  try {
    let user = await User.findOne({ username });
    if (user) {
      //user already exists
      return res.status(409).json({ message: 'User already exists' });
    }
    user = await User.findOne({ email });
    if(user) {
      //user already exists
      return res.status(409).json({ message: 'User already exists' });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(unhashedPassword, 10);
    //create user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
      githubID: '',
      isVerified: false,
      isBanned: false
    });
    //save user
    const savedUser = await newUser.save();
    //set session
    req.session.user = savedUser as Tuser;
    //generate email token
    generateEmailToken(savedUser as unknown as (Tuser & Types.ObjectId));
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
