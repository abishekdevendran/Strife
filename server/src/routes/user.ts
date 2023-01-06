import express from 'express';
import userLogoutController from '../controllers/userLogoutController';
import userDataController from '../controllers/userDataController';
const router = express.Router();

router.get('/logout', userLogoutController);
router.get('/:userId', userDataController);
router.get('/', userDataController);

export default router;
