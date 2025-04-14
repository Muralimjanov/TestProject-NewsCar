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

const router = Router();

router.post('/', newsExclusiveCreate);
router.post('/many', newsExclusiveCreateMany);
router.get('/', newsExclusiveGetAll);
router.get('/:id', newsExclusiveGetId);
router.patch('/:id', newsExclusiveUpdateId);
router.patch('/', newsExclusiveUpdateAll);
router.delete('/:id', newsExclusiveDeleteId);
router.delete('/', newsExclusiveDeleteAll);

export default router;