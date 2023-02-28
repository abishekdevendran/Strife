import { Request, Response } from 'express';
import Server from '../models/Server';
import User, { Tuser } from '../models/User';

export default async function serverMemberController(
	req: Request,
	res: Response
) {
	if (req.session.user) {
		//if body doesnt  have server id
		if (!req.body.serverId) {
			return res.status(400).json({ message: 'Server id is required' });
		}
		try {
			//check if user already exists in server
			const server = await Server.findById(req.body.serverId);
			if (!server) {
				return res.status(404).json({ message: 'Server not found' });
			}
			const user = await User.findById(req.session.user._id);
			//if user is not found
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			//if user is already in server
			server.users.forEach((serverUser: any) => {
				if (serverUser._id === user._id) {
					return res.status(400).json({ message: 'User already in server' });
				}
			});
			//add user to server
			server.users.push({ user: (user as any)._id, role: 'member' });
			await server.save();
			//add server to user
			user.servers.push((server as any)._id);
			await user.save();
			//update user session
			req.session.user = user as unknown as Tuser;
			return res.status(200).json({ message: 'User added to server' });
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({ message: err.message });
			} else {
				return res.status(500).json({ message: 'Internal server error' });
			}
		}
	}
}
