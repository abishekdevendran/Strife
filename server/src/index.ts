import express, { Express } from 'express';
import session from './utils/sessionStore';
import './utils/db';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import http from 'http';
import { Server } from 'socket.io';

import root from './routes/_index';
import login from './routes/login';
import register from './routes/register';
import verify from './routes/verify';
import user from './routes/user';
import serverRoute from './routes/server';
import { Tuser } from './models/User';
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_URL!, 'http://localhost:3000'],
	},
});

const PORT = process.env.PORT!;

declare module 'express-session' {
	interface SessionData {
		user: Tuser;
	}
}

app.use(helmet());
app.use(
	cors({
		credentials: true,
		origin: [process.env.FRONTEND_URL!, 'http://localhost:3000'],
	})
);
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use('/', root);
app.use('/login', login);
app.use('/register', register);
app.use('/verify', verify);
app.use('/user', user);
app.use('/server', serverRoute);
//TODO: add Socket.io routing
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
