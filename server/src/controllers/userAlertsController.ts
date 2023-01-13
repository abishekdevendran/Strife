import { Request, Response } from 'express';
import getFriendRequests from '../utils/getFriendRequests';

export default async function userAlertsController(
	req: Request,
	res: Response
) {
	try {
		//get pending friend requests
		const friendRequests = await getFriendRequests(req.session.user!._id);
		res.status(200).json({ friendRequests });
	} catch (err) {
    if (err instanceof Error) {
			res.status(500).json({ message: err.message });
		}
		res.status(500).json({ message: 'Something went wrong' });
	}
}
