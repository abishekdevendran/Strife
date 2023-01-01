import express from 'express';
import emailRegenerateController from '../controllers/emailRegenerateController';
import emailVerifyController from '../controllers/emailVerifyController';
const router = express.Router();

router.post('/regenerate', emailRegenerateController);
router.get('/:token', emailVerifyController);

export default router;
