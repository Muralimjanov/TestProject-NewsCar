import { Router } from "express";
import {
    newsExclusiveCreate,
    newsExclusiveCreateMany,
    newsExclusiveGetAll,
    newsExclusiveGetId,
    newsExclusiveUpdateId,
    newsExclusiveUpdateAll,
    newsExclusiveDeleteId,
    newsExclusiveDeleteAll
} from "../Controllers/newsExclusiveControllers.js";

import { validateNewsExclusive } from "../Validations/newsExclusiveValidation.js";
import { validateBody } from "../Middleware/validateBody.js";

const router = Router();

router.post('/', validateBody(validateNewsExclusive), newsExclusiveCreate);
router.post('/many', newsExclusiveCreateMany);
router.get('/', newsExclusiveGetAll);
router.get('/:id', newsExclusiveGetId);
router.patch('/:id', validateBody(validateNewsExclusive), newsExclusiveUpdateId);
router.patch('/', newsExclusiveUpdateAll);
router.delete('/:id', newsExclusiveDeleteId);
router.delete('/', newsExclusiveDeleteAll);

export default router;