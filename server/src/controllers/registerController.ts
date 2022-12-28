import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import EmailToken from '../models/EmailToken';
import User, { Tuser } from '../models/User';
import sendMail from '../utils/email';

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
    user = await User.findOne({ email: '' });
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
    //generate email token with only alphanumeric characters
    const randomToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const emailToken = new EmailToken({
      _userId: savedUser._id,
      token: randomToken,
      expireAt: new Date(Date.now() + 3600000)
    });
    //save email token
    await emailToken.save();
    //send email
    sendMail(savedUser.username!, savedUser.email, randomToken);
    return res
      .status(200)
      .json({ message: 'Registration successful, confirm email!' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
