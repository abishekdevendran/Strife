import express, { Express } from 'express';
import session from './utils/sessionStore';
import './utils/db';
import dotenv from 'dotenv';
import morgan from 'morgan';

import root from './routes/_index';
import login from './routes/login';
import register from './routes/register';
import { Tuser } from './models/User';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT!;

declare module 'express-session' {
  interface SessionData {
    user: Tuser;
  }
}

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use('/', root);
app.use('/login', login);
app.use('/register', register);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
