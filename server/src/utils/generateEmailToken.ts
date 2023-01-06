import { Tuser } from '../models/User';
import EmailToken from '../models/EmailToken';
import { Types } from 'mongoose';
import sendMail from './email';

export default async function generateEmailToken(user: Tuser & Types.ObjectId) {
	//check if token exists
	const tokenFound = await EmailToken.findOne({ _userId: user._id });
	if (tokenFound) {
		return {
			status: 400,
			message: 'Token generation on cooldown',
			expireAt: tokenFound.expireAt,
		};
	}
	//keep looping till unique token
	let randomToken;
	while (true) {
		randomToken = Math.random().toString(36).substring(2, 15);
		const tokenFound = await EmailToken.findOne({ token: randomToken });
		if (!tokenFound) {
			break;
		}
	}
	try {
		//create token
		const emailToken = new EmailToken({
			_userId: user._id,
			token: randomToken,
			expireAt: new Date(Date.now() + 3600000),
		});
		//save token
		await emailToken.save();
		//send email
		sendMail(user.username, user.email, randomToken);
		return {
			status: 200,
			message: 'Token generated',
			expireAt: emailToken.expireAt,
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			message: 'Internal server error',
		};
	}
}
