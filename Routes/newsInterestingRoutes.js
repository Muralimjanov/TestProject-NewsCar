import { Router } from 'express';
import {
    newsInterestingGetAll,
    newsInterestingGetOne,
    newsInterestingCreate,
    newsInterestingUpdate,
    newsInterestingRemove
} from '../Controllers/newsInterestingControllers.js';
import { newsInterestingValidation } from '../Validations/newsInterestingValidation.js';
import { handleValidationErrors } from '../Middleware/handleValidationErrors.js';

const router = Router();

router.get('/', newsInterestingGetAll);
router.get('/:id', newsInterestingGetOne);
router.post('/', newsInterestingValidation, handleValidationErrors, newsInterestingCreate);
router.patch('/:id', newsInterestingValidation, handleValidationErrors, newsInterestingUpdate);
router.delete('/:id', newsInterestingRemove);

export default router;
