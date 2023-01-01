import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient
  .connect()
  .then(() => console.log('Redis Connected Successfully.'))
  .catch((err) => console.log('Redis Connection Failed: ', err));

redisClient.on('error', (err) => {
  console.log('Redis Error: ', err);
});

const RedisStore = connectRedis(session);
const secretKey = process.env.SESSION_SECRET || 'secret';

export default session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: secretKey,
  resave: false,
  proxy: true,
  name: 'strifeAuth',
  cookie: {
    // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
    sameSite: 'none',
    // secure: process.env.NODE_ENV === 'production',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true
  }
});
