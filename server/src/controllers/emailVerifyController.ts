import { Request, Response } from 'express';
import verifyEmail from '../utils/verifyEmail';

const emailVerifyController = async (req: Request, res: Response) => {
	const { status, message } = await verifyEmail(req);
	res.status(status).json({ message });
};

export default emailVerifyController;
