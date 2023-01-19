import express from 'express';
import serverDataHandler from '../controllers/serverDataHandler';
import serverMemberController from '../controllers/serverMemberController';
import isAuth from '../middlewares/isAuth';
const router = express.Router();

router.all('/join', isAuth, serverMemberController);
router.get('/:serverId', isAuth, serverDataHandler);
router.post('/', isAuth, serverDataHandler);

export default router;
