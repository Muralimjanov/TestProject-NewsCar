import { Router } from 'express';
import {
    getOne,
    auctionGetAll,
    auctionPatch,
    auctionPost,
    auctionRemove,
} from '../Controllers/auctionController.js';

const router = Router();

router.get('/auction', auctionGetAll);
router.get('/auction:id', getOne);
router.post('/auction', auctionPost);
router.patch('/auction:id', auctionPatch);
router.delete('/auction:id', auctionRemove);


export default router;
