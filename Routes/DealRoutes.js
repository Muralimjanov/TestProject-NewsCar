import { Router } from 'express';
import {
    getAllDeals,
    getDealById,
    createDeal,
    deleteDeal,
    downloadDealDocuments
} from '../Controllers/DealController.js';
import { checkAuth } from '../Middleware/authMiddleware.js';
import { validateRequestByRole } from '../Middleware/validateRequest.js';

const router = Router();

router.get('/', checkAuth, validateRequestByRole('admin'), getAllDeals);
router.get('/:id', checkAuth, getDealById);
router.post('/', checkAuth, validateRequestByRole('admin'), createDeal);
router.delete('/:id', checkAuth, validateRequestByRole('admin'), deleteDeal);
router.get('/download/:id', checkAuth, downloadDealDocuments)

export default router;
