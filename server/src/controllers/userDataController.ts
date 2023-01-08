import { Request, Response } from 'express';
import User from '../models/User';

const userDataController = async (req: Request, res: Response) => {
	if (!req.session.user) {
		res.status(401).send({ message: 'User not logged in' });
	} else {
		if (req.params.userId) {
			let censoredUser: any = await User.findById(req.params.userId);
			if (!censoredUser) {
				res.status(404).send({ message: 'User not found' });
			}
			//delete password, email, and githubID from censoredUser
			['password', 'email', 'githubID'].forEach(
				(key) => delete censoredUser[key]
			);
			//check if user is a friend of req.session.user
			const isFriend = censoredUser!.friends.some(
				(friend: any) =>
					friend._id.toString() === req.session.user!._id.toString()
			);
			if (!isFriend) {
				//delete friends from censoredUser
				delete censoredUser.friends;
			}
			censoredUser.isFriend = isFriend;
			console.log(censoredUser);
			return res.status(200).send({ user: censoredUser });
		}
		let censoredUser: any = { ...req.session.user };
		delete censoredUser.password;
		res.status(200).send({ user: censoredUser });
	}
};

export default userDataController;
