import { Router } from "express";
import {
    addNewsCar,
    updateNewsIdCar,
    deleteNewsIdCar,
    getNewsCarById,
    getAllNewsCars
} from "../Controllers/newsCarControllers.js";

const router = Router();

router.post('/', addNewsCar);
router.patch('/:id', updateNewsIdCar);
router.delete('/:id', deleteNewsIdCar);
router.get('/:id', getNewsCarById);
router.get('/', getAllNewsCars);

export default router;
