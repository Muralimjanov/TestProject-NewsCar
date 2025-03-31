import {
    addNewCar,
    updateIdCar,
    deleteIdCar,
    getCarById,
    getAllCars,
} from "../Controllers/newCarControllers.js";
import express from 'express';

const router = express.Router();

router.post('/', addNewCar);
router.patch('/:id', updateIdCar);
router.delete('/:id', deleteIdCar);
router.get('/:id', getCarById);
router.get('/', getAllCars);

export default router;
