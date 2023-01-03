import { Request } from 'express';
import fetch from 'node-fetch';
import User, { Tuser } from '../models/User';

export default async function userMerger(json: any, req: Request) {
  try {
    //get user info from github
    console.log('A');
    const user = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${json.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    const gitUser: any = await user.json();
    if (!gitUser) {
      return { message: 'Github user not found', status: 404 };
    }
    console.log('gitUser:', gitUser);
    //get all emails from github
    const emails = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${json.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    console.log('B ');
    const gitEmails: any = await emails.json();
    if (req.session.user) {
      const dbUser = await User.findOne({ email: req.session.user.email });
      dbUser!.githubID = gitUser.id;
      await dbUser!.save();
      return { message: 'OAuth method added successfully.', status: 200 };
    }
    //if github id exists in database, login
    const existingUser = await User.findOne({ githubID: gitUser.id });
    if (existingUser) {
      req.session.user = existingUser as Tuser;
      return { message: 'User already exists.', status: 200 };
    }
    //get list of possible existing users
    const possibleUsers = await User.find({
      email: { $in: gitEmails.map((emailEntry: any) => emailEntry.email) }
    });
    if (possibleUsers.length === 0) {
      //add new entry
      const newUser = new User({
        email: gitUser.email,
        githubId: gitUser.id,
        username: gitUser.login,
        createdAt: new Date().toISOString()
      });
      await newUser.save();
      req.session.user = newUser as Tuser;
      return { message: 'New user added successfully.', status: 200 };
    }
    const verifiedEmails = gitEmails.filter(
      (emailEntry: any) => emailEntry.verified
    );
    if (verifiedEmails.length === 0) {
      return { message: 'No verified email found.', status: 404 };
    }
    const verifiedEmail = verifiedEmails[0];
    const verifiedUser = possibleUsers.find(
      (user) => user.email === verifiedEmail.email
    );
    if (verifiedUser) {
      //add github id to existing user
      verifiedUser.githubID = gitUser.id;
      await verifiedUser.save();
      req.session.user = verifiedUser as Tuser;
      return { message: 'OAuth method added successfully.', status: 200 };
    }
    return { message: 'Something went wrong.', status: 500 };
  } catch (err) {
    console.error(err);
    return { message: 'Something went wrong.', status: 500 };
  }
}
