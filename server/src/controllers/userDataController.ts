import { Request, Response } from 'express';
import Server from '../models/Server';
import User from '../models/User';

const userDataController = async (req: Request, res: Response) => {
	if (!req.session.user) {
		res.status(401).send({ message: 'User not logged in' });
	} else {
		if (req.params.userId) {
			console.log(req.params.userId);
			let censoredUser: any = await User.findById(req.params.userId);
			if (!censoredUser) {
				return res.status(404).send({ message: 'User not found' });
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
			const mutualServers = censoredUser!.servers.filter((server: any) => {
				return req.session.user!.servers.some((userServer: any) => {
					return userServer._id.toString() === server._id.toString();
				});
			});
			if (!isFriend) {
				//delete friends from censoredUser
				delete censoredUser.friends;
				delete censoredUser.servers;
			} else {
				//get data of friends
				const friendData = await User.find({
					_id: { $in: censoredUser.friends },
				});
				censoredUser.friends = friendData;
			}
			//get names of mutual servers
			const serverData = await Server.find({ _id: { $in: mutualServers } });
			censoredUser.mutualServers = serverData;
			censoredUser.isFriend = isFriend;
			console.log(censoredUser);
			return res.status(200).send({ user: censoredUser });
		}
		let censoredUser: any = { ...req.session.user };
		delete censoredUser.password;
		delete censoredUser.githubID;
		const serverData = await Server.find({
			_id: { $in: censoredUser.servers },
		});
		censoredUser.servers = serverData;
		const friendData = await User.find({ _id: { $in: censoredUser.friends } });
		censoredUser.friends = friendData;
		res.status(200).send({ user: censoredUser });
	}
};

export default userDataController;
