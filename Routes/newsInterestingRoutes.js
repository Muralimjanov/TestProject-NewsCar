import { Router } from 'express';
import {
    newsInterestingGetAll,
    newsInterestingGetOne,
    newsInterestingCreate,
    newsInterestingCreateMany,
    newsInterestingUpdate,
    newsInterestingUpdateMany,
    newsInterestingRemove,
    newsInterestingRemoveMany
} from '../Controllers/newsInterestingControllers.js';
import { newsInterestingValidation } from '../Validations/newsInterestingValidation.js';
import { handleValidationErrors } from '../Middleware/handleValidationErrors.js';

const router = Router();

router.get('/', newsInterestingGetAll);
router.get('/:id', newsInterestingGetOne);
router.post('/', newsInterestingValidation, handleValidationErrors, newsInterestingCreate);
router.post('/many', newsInterestingCreateMany);
router.patch('/:id', newsInterestingValidation, handleValidationErrors, newsInterestingUpdate);
router.patch('/', newsInterestingUpdateMany);
router.delete('/:id', newsInterestingRemove);
router.delete('/', newsInterestingRemoveMany);

export default router;
