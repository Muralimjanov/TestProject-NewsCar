import { NewsAdvice } from "../Models/newsAdviceModel.js";

export const newsAdviceCreate = async (req, res) => {
    try {
        const advice = await NewsAdvice.create(req.body);
        res.status(201).json(advice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsAdviceCreateMany = async (req, res) => {
    try {
        const advices = await NewsAdvice.insertMany(req.body);
        res.status(201).json(advices);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsAdviceGetAll = async (_req, res) => {
    try {
        const all = await NewsAdvice.find();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsAdviceGetId = async (req, res) => {
    try {
        const one = await NewsAdvice.findById(req.params.id);
        if (!one) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(one);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsAdviceUpdateId = async (req, res) => {
    try {
        const updated = await NewsAdvice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsAdviceUpdateAll = async (req, res) => {
    try {
        const updates = await Promise.all(
            req.body.map(({ _id, ...data }) =>
                NewsAdvice.findByIdAndUpdate(_id, data, { new: true })
            )
        );
        res.json(updates);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const newsAdviceDeleteId = async (req, res) => {
    try {
        const deleted = await NewsAdvice.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const newsAdviceDeleteAll = async (_req, res) => {
    try {
        await NewsAdvice.deleteMany();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
