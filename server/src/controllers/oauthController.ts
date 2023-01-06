import { Request, Response } from 'express';
import dotenv from 'dotenv';
// import { getGithubAccessToken } from "src/utils/getAccessToken";
import fetch from 'node-fetch';
import userMerger from '../utils/userMerger';
dotenv.config();

export async function githubCallback(req: Request, res: Response) {
	//get code from request
	const code = req.query.code;
	console.log('code: ', code);
	//get access token from github
	const body = {
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		code,
	};
	const accessToken = await fetch(
		'https://github.com/login/oauth/access_token',
		{
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		}
	);
	const json = await accessToken.json();
	console.log('accessToken: ', json.access_token);
	if (!json.access_token) {
		res.status(401).send({ message: 'Github access token not found' });
	}
	const { status, message } = await userMerger(json, req);
	return res.status(status).json({ message });
}
