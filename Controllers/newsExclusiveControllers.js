import { NewsExclusive } from "../Models/newsExclusiveModel.js";
import { validateNewsExclusive } from '../Validations/newsExclusiveValidation.js';

export const newsExclusiveCreate = async (req, res) => {
    const { error } = validateNewsExclusive.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const news = await NewsExclusive.create(req.body);
        res.status(201).json(news);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsExclusiveCreateMany = async (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Ожидается массив объектов' });
    }

    for (let item of req.body) {
        const { error } = validateNewsExclusive.validate(item);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
    }

    try {
        const newsList = await NewsExclusive.insertMany(req.body);
        res.status(201).json(newsList);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsExclusiveGetAll = async (_req, res) => {
    try {
        const all = await NewsExclusive.find();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsExclusiveGetId = async (req, res) => {
    try {
        const one = await NewsExclusive.findById(req.params.id);
        if (!one) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(one);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsExclusiveUpdateId = async (req, res) => {
    const { error } = validateNewsExclusive.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updated = await NewsExclusive.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsExclusiveUpdateAll = async (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Ожидается массив' });
    }

    try {
        const updates = await Promise.all(
            req.body.map(({ _id, ...data }) => {
                const { error } = validateNewsExclusive.validate(data);
                if (error) throw new Error(error.details[0].message);

                return NewsExclusive.findByIdAndUpdate(_id, data, { new: true });
            })
        );
        res.json(updates);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsExclusiveDeleteId = async (req, res) => {
    try {
        const deleted = await NewsExclusive.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsExclusiveDeleteAll = async (_req, res) => {
    try {
        await NewsExclusive.deleteMany();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
