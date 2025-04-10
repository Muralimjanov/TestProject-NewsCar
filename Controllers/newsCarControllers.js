import { NewsCar } from "../Models/newsCarModels.js";

export const addNewsCar = async (req, res) => {
    try {
        const newsCar = new NewsCar(req.body);
        await newsCar.save();
        res.status(201).json(newsCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateNewsIdCar = async (req, res) => {
    try {
        const updatedNewsCar = await NewsCar.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
            }
        );
        if (!updatedNewsCar) return res.status(404).json({ message: "Машина не найдена" });
        res.json(updatedNewsCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteNewsIdCar = async (req, res) => {
    try {
        const deletedNewsCar = await NewsCar.findByIdAndDelete(req.params.id);
        if (!deletedNewsCar) return res.status(404).json({ message: "Машина не найдена" });
        res.json({ message: "Машина удалена" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getNewsCarById = async (req, res) => {
    try {
        const newsCar = await NewsCar.findById(req.params.id);
        if (!newsCar) return res.status(404).json({ message: "Машина не найдена" });
        res.json(newsCar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllNewsCars = async (req, res) => {
    try {
        const newsCars = await NewsCar.find();
        res.json(newsCars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}