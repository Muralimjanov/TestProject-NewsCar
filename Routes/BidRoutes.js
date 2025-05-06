import { Router } from 'express';
import {
    placeBid,
    getBidsByAuction,
    adminCreateBid,
    adminUpdateBid,
    adminDeleteBid
} from '../Controllers/BidControllers.js';
import { validateRequest } from '../Middleware/validateRequest.js';
import { checkAuth } from '../Middleware/authMiddleware.js';

const router = Router();

router.post('/', checkAuth, validateRequest('company'), placeBid);
router.get('/:auctionId', checkAuth, getBidsByAuction);

router.post('/admin', checkAuth, validateRequest('admin'), adminCreateBid);
router.put('/admin/:bidId', checkAuth, validateRequest('admin'), adminUpdateBid);
router.delete('/admin/:bidId', checkAuth, validateRequest('admin'), adminDeleteBid);

export default router;
