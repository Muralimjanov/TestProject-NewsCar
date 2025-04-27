import { newsInterestingModels } from '../Models/newsInterestingModels.js';

export const newsInterestingGetAll = async (req, res) => {
    try {
        const data = await newsInterestingModels.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных' });
    }
};

export const newsInterestingGetOne = async (req, res) => {
    try {
        const item = await newsInterestingModels.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Элемент не найден' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении элемента' });
    }
};

export const newsInterestingCreate = async (req, res) => {
    try {
        const doc = new newsInterestingModels(req.body);
        const saved = await doc.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании', error });
    }
};

export const newsInterestingCreateMany = async (req, res) => {
    try {
        const docs = await newsInterestingModels.insertMany(req.body);
        res.status(201).json(docs);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при массовом создании', error });
    }
};

export const newsInterestingUpdate = async (req, res) => {
    try {
        const updated = await newsInterestingModels.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Элемент не найден' });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при обновлении', error });
    }
};

export const newsInterestingUpdateMany = async (req, res) => {
    try {
        const { filter, update } = req.body;
        const result = await newsInterestingModels.updateMany(filter, update);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при массовом обновлении', error });
    }
};

export const newsInterestingRemove = async (req, res) => {
    try {
        const deleted = await newsInterestingModels.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Элемент не найден' });
        }
        res.json({ message: 'Удалено успешно' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении' });
    }
};

export const newsInterestingRemoveMany = async (req, res) => {
    try {
        const { filter } = req.body;
        const result = await newsInterestingModels.deleteMany(filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при массовом удалении', error });
    }
};
