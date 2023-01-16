import express from 'express';
import serverDataHandler from '../controllers/serverDataHandler';
import isAuth from '../middlewares/isAuth';
const router = express.Router();

router.get('/:serverId', isAuth, serverDataHandler);
router.post('/', isAuth, serverDataHandler);

export default router;
