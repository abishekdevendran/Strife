import { Request } from 'express';
import User, { Tuser } from '../models/User';
import EmailToken from '../models/EmailToken';

export default async function verifyEmail(req: Request) {
	const { token } = req.params;
	if (!req.session.user) {
		return {
			status: 401,
			message: 'Unauthorized',
		};
	}
	try {
		const user = await User.findOne({ email: req.session.user!.email });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
			};
		}
		const tokenFound = await EmailToken.findOne({ _userId: user!._id });
		if (!tokenFound) {
			return {
				status: 404,
				message: 'Token not found',
			};
		}
		if (tokenFound.token !== token) {
			return {
				status: 401,
				message: 'Unauthorized',
			};
		}
		if (tokenFound.expireAt < new Date()) {
			return {
				status: 401,
				message: 'Unauthorized',
			};
		}
		user!.isVerified = true;
		await user!.save();
		//delete token
		await EmailToken.deleteOne({ _userId: user!._id });
		//update session
		req.session.user = user as Tuser;
		//send response
		return {
			status: 200,
			message: 'Email verified',
		};
	} catch (err) {
		return {
			status: 500,
			message: 'Internal server error',
		};
	}
}
