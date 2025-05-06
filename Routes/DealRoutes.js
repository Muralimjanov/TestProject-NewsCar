import { Router } from 'express';
import {
    getAllDeals,
    getDealById,
    createDeal,
    deleteDeal,
    downloadDealDocuments
} from '../Controllers/DealController.js';
import { checkAuth } from '../Middleware/authMiddleware.js';
import { validateRequest } from '../Middleware/validateRequest.js';

const router = Router();

router.get('/', checkAuth, validateRequest('admin'), getAllDeals);
router.get('/:id', checkAuth, getDealById);
router.post('/', checkAuth, validateRequest('admin'), createDeal);
router.delete('/:id', checkAuth, validateRequest('admin'), deleteDeal);
router.get('/download/:id', checkAuth, downloadDealDocuments)

export default router;
