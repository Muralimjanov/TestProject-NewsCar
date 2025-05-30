import { Router } from "express";
import {
    newsAdviceCreate,
    newsAdviceCreateMany,
    newsAdviceGetAll,
    newsAdviceGetId,
    newsAdviceUpdateId,
    newsAdviceUpdateAll,
    newsAdviceDeleteId,
    newsAdviceDeleteAll
} from "../Controllers/newsAdviceControllers.js";

import { validateBody } from "../Middleware/validateBody.js";
import { validateId } from "../Middleware/validateIdMongoose.js";
import { validateNewsAdvice, validateNewsAdviceArray } from "../Validations/newsAdviceValidation.js";

const router = Router();

router.post('/', validateBody(validateNewsAdvice), newsAdviceCreate);
router.post('/many', validateBody(validateNewsAdviceArray), newsAdviceCreateMany);
router.get('/', newsAdviceGetAll);
router.get('/:id', validateId, newsAdviceGetId);
router.patch('/:id', validateId, validateBody(validateNewsAdvice), newsAdviceUpdateId);
router.patch('/', validateBody(validateNewsAdvice), newsAdviceUpdateAll);
router.delete('/:id', validateId, newsAdviceDeleteId);
router.delete('/', newsAdviceDeleteAll);

export default router;
