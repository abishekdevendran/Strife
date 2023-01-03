import express from 'express';
import { githubCallback } from '../controllers/oauthController';
import loginController from '../controllers/loginController';
const router = express.Router();

router.get('/oauth/github', githubCallback);
router.post('/', loginController);

export default router;
