import { Router } from "express";
import {
    addNewsCar,
    updateNewsIdCar,
    deleteNewsIdCar,
    getNewsCarById,
    getAllNewsCars
} from "../Controllers/newsCarControllers.js";

import { validateNewsCar } from "../Validations/newsCarValidation.js";
import { validateBody } from "../Middleware/validateBody.js";
import { validateId } from "../Middleware/validateIdMongoose.js";

const router = Router();

router.post('/', validateBody(validateNewsCar), addNewsCar);
router.patch('/:id', validateId, validateBody(validateNewsCar), updateNewsIdCar);
router.delete('/:id', deleteNewsIdCar);
router.get('/:id', getNewsCarById);
router.get('/', getAllNewsCars);

export default router;
