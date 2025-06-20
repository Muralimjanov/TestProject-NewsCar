import { Router } from 'express';
import {
    getAllDeals,
    getDealById,
    createDeal,
    deleteDeal,
    downloadDealDocuments,
    updateDeal
} from '../Controllers/DealController.js';
import { checkAuth } from '../Middleware/authMiddleware.js';
import { validateRequestByRole } from '../Middleware/validateRequest.js';
import { dealSchema } from '../Validations/DealValidation.js';

const router = Router();

router.get('/', checkAuth, validateRequestByRole({ admin: dealSchema }), getAllDeals);
router.get('/:id', checkAuth, getDealById);
router.post('/', checkAuth, validateRequestByRole({ admin: dealSchema }), createDeal);
router.delete('/:id', checkAuth, validateRequestByRole({ admin: dealSchema }), deleteDeal);
router.get('/download/:id', checkAuth, downloadDealDocuments);
router.patch("/:dealId", checkAuth, updateDeal);

export default router;
