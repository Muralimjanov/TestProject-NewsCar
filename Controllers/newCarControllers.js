import { NewCar } from "../Models/NewCar.js";

export const addNewCar = async (req, res) => {
    try {
        const newCar = new NewCar(req.body);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateIdCar = async (req, res) => {
    try {
        const updatedCar = await NewCar.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
            }
        );
        if (!updatedCar) return res.status(404).json({ message: "Машина не найдена" });
        res.json(updatedCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteIdCar = async (req, res) => {
    try {
        const deletedCar = await NewCar.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ message: "Машина не найдена" });
        res.json({ message: "Машина удалена" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCarById = async (req, res) => {
    try {
        const car = await NewCar.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Машина не найдена" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllCars = async (req, res) => {
    try {
        const cars = await NewCar.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}