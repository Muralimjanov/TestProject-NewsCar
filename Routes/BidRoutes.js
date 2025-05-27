import { Router } from 'express';
import {
    placeBid,
    getBidsByAuction,
    adminCreateBid,
    adminUpdateBid,
    adminDeleteBid
} from '../Controllers/BidControllers.js';
import { validateRequestByRole } from '../Middleware/validateRequest.js';
import { checkAuth } from '../Middleware/authMiddleware.js';

const router = Router();

router.post('/', checkAuth, validateRequestByRole('company'), placeBid);
router.get('/:auctionId', checkAuth, getBidsByAuction);

router.post('/admin', checkAuth, validateRequestByRole('admin'), adminCreateBid);
router.put('/admin/:bidId', checkAuth, validateRequestByRole('admin'), adminUpdateBid);
router.delete('/admin/:bidId', checkAuth, validateRequestByRole('admin'), adminDeleteBid);

export default router;
