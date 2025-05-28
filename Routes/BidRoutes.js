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
import { bidSchema } from '../Validations/BidValidation.js';

const router = Router();

router.post('/',
    checkAuth,
    validateRequestByRole({ company: bidSchema }),
    placeBid
);
router.get('/:auctionId', checkAuth, getBidsByAuction);

router.post(
    '/admin',
    checkAuth,
    validateRequestByRole({ admin: bidSchema }),
    adminCreateBid
);
router.put(
    '/admin/:bidId',
    checkAuth,
    validateRequestByRole({ admin: bidSchema }),
    adminUpdateBid
);

router.delete(
    '/admin/:bidId',
    checkAuth,
    validateRequestByRole({ admin: bidSchema }),
    adminDeleteBid
);

export default router;
