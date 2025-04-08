import * as model from '../Models/auctionModel.js';
import {auctionsValidate} from '../Validations/auctionValidate.js';

export const auctionGetAll = (req, res) => res.json(model.getAll());

export const getOne = (req, res) => {
    const id = parseInt(req.params.id);
    const result = model.getOne(id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
};

export const auctionPost = (req, res) => {
    try {
        auctionsValidate(req.body);
        const created = model.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const auctionPatch = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        auctionsValidate({ ...model.getOne(id), ...req.body });
        const updated = model.update(id, req.body);
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const auctionRemove = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = model.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
};