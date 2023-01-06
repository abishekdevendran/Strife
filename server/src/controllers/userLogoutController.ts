import { Request, Response } from 'express';

const userLogoutController = (req: Request, res: Response) => {
	if (!req.session.user) {
		res.status(401).send({ message: 'User not logged in' });
	} else {
		req.session.destroy((err) => {
			if (err) {
				res.status(500).send({ message: 'Internal server error' });
			} else {
				res.status(200).send({ message: 'Logout successful' });
			}
		});
	}
};

export default userLogoutController;
