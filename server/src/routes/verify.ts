import express from 'express';
import emailVerifyController from '../controllers/emailVerifyController';
const router = express.Router();

router.get('/:token', emailVerifyController);

export default router;
