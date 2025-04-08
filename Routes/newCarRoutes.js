import { Router } from "express";
import {
    addNewCar,
    updateIdCar,
    deleteIdCar,
    getCarById,
    getAllCars,
} from "../Controllers/newCarControllers.js";

const router = Router();

router.post('/', addNewCar);
router.patch('/:id', updateIdCar);
router.delete('/:id', deleteIdCar);
router.get('/:id', getCarById);
router.get('/', getAllCars);

export default router;
