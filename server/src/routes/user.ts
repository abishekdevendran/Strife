import express from 'express';
import userLogoutController from '../controllers/userLogoutController';
import userDataController from '../controllers/userDataController';
import isAuth from '../middlewares/isAuth';
import userAlertsController from '../controllers/userAlertsController';
const router = express.Router();

router.get('/logout', isAuth, userLogoutController);
router.get('/alerts', isAuth, userAlertsController)
router.get('/:userId', userDataController);
router.get('/', userDataController);

export default router;
