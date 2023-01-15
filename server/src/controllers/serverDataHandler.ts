import { Request, Response } from 'express';
import Server from '../models/Server';

export default async function serverDataHandler(req: Request, res: Response) {
	if (req.method === 'GET') {
		try {
			const server = await Server.findById(req.params.serverId);
			if (!server) {
				return res.status(404).json({ message: 'Server not found' });
			}
			if (!req.session.user) {
				delete (server as any).users;
			}
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
			const newServer = new Server({
				name: req.body.name,
				createdAt: new Date().toISOString(),
				users: [{ user: req.session.user!._id, role: 'owner' }],
				userCount: 1,
			});
      await newServer.save();
      res.status(201).json({ server: newServer });
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
}
