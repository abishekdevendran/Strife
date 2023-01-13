import express from 'express';
import serverDataHandler from '../controllers/serverDataHandler';
const router = express.Router();

router.get('/:serverId', serverDataHandler);

export default router;