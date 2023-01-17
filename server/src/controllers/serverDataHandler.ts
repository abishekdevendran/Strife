import { Request, Response } from 'express';
import Server from '../models/Server';
import User, { Tuser } from '../models/User';

export default async function serverDataHandler(req: Request, res: Response) {
	if (req.method === 'GET') {
		try {
			const serverItem = await Server.findById(req.params.serverId);
			if (!serverItem) {
				return res.status(404).json({ message: 'Server not found' });
			}
			const server= serverItem?.toJSON();
			if (!req.session.user) {
				delete (server as any).users;
			}
			//get data of server owner
			const ownerId = server.users.find((user) => user.role === 'owner')?.user;
			const owner = await User.findById(ownerId);
			if (!owner) {
				return res.status(404).json({ message: 'Server owner not found' });
			}
			(server as any).owner = owner;
			console.log(server);
			res.status(200).json({ server });
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	if (!req.session.user) {
		res.status(401).json({ message: 'Unauthorized' });
	}
	if (req.method === 'POST') {
		try {
			const server = await Server.findOne({ name: req.body.name });
			if (server) {
				//server already exists
				return res.status(400).json({ message: 'Server already exists' });
			}
			const user = await User.findById(req.session.user!._id);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			const newServer = new Server({
				name: req.body.name,
				description: req.body.description || 'no description yet :(',
				createdAt: new Date().toISOString(),
				isPrivate: req.body.isPrivate,
				users: [{ user: req.session.user!._id, role: 'owner' }],
				userCount: 1,
			});
			await newServer.save();
			user.servers.push(newServer._id);
			await user.save();
			// refresh user data on redis
			req.session.user = user as unknown as Tuser;
			return res.status(201).json({ server: newServer });
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({ message: err.message });
			}
			return res.status(500).json({ message: 'Something went wrong' });
		}
	}
}
