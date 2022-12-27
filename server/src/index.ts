import express, { Express } from 'express';
import session from './utils/sessionStore';
import dotenv from 'dotenv';
import root from './routes/_index';
import login from './routes/login';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT!;

declare module 'express-session' {
  interface SessionData {
    name: string;
    email: string;
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use('/', root);
app.use('/login', login);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
