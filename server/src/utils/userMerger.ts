import { Request } from 'express';
import fetch from 'node-fetch';
import User, { Tuser } from '../models/User';

export default async function userMerger(json: any, req: Request) {
	try {
		//get user info from github
		const user = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `token ${json.access_token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
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
				Accept: 'application/json',
			},
		});
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
			req.session.user = existingUser as unknown as Tuser;
			return { message: 'Login Successful', status: 200 };
		}
		//get list of possible existing users
		const possibleUsers = await User.find({
			email: { $in: gitEmails.map((emailEntry: any) => emailEntry.email) },
		});
		const verifiedEmails = gitEmails.filter(
			(emailEntry: any) => emailEntry.verified
		);
		if (possibleUsers.length === 0) {
			let email: string, isVerified: boolean;
			if (verifiedEmails.length === 0) {
				email = gitUser.email;
				isVerified = false;
			} else {
				email = verifiedEmails[0].email;
				isVerified = true;
			}
			//add new entry
			const newUser = new User({
				email,
				githubID: gitUser.id,
				username: gitUser.login,
				createdAt: new Date().toISOString(),
				isVerified,
			});
			await newUser.save();
			req.session.user = newUser as unknown as Tuser;
			return { message: 'New user added successfully.', status: 200 };
		}
		if (verifiedEmails.length === 0) {
			return { message: 'No verified email found.', status: 404 };
		}
		for (const verifiedEmail of verifiedEmails) {
			const verifiedUser = possibleUsers.find(
				(user) => user.email === verifiedEmail.email
			);
			if (verifiedUser) {
				//add github id to existing user
				verifiedUser.githubID = gitUser.id;
				verifiedUser.isVerified = true;
				await verifiedUser.save();
				req.session.user = verifiedUser as unknown as Tuser;
				return { message: 'OAuth method added successfully.', status: 200 };
			}
		}
		return { message: 'Something went wrong.', status: 500 };
	} catch (err) {
		console.error(err);
		return { message: 'Something went wrong.', status: 500 };
	}
}
