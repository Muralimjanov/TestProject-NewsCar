import { Salesman } from '../Models/SalesmanModels.js';
import { salesmanValidations } from '../Validations/SalesmanValidation.js';
import { fetchCompanyInfoByInn } from '../services/innService.js';
import { validateInn } from '../utils/validateInn.js';
import { Types } from 'mongoose';

const isValidObjectId = (id) => Types.ObjectId.isValid(id);

export const createSalesman = async (req, res) => {
    try {
        const { error } = salesmanValidations.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { inn } = req.body;

        if (!validateInn(inn)) {
            return res.status(400).json({ message: 'Некорректный ИНН' });
        }

        const innInfo = await fetchCompanyInfoByInn(inn);
        if (!innInfo.success) {
            return res.status(400).json({ message: innInfo.message || 'ИНН не найден' });
        }

        const existing = await Salesman.findOne({ inn });
        if (existing) {
            return res.status(409).json({ message: 'Продавец с таким ИНН уже существует' });
        }

        req.body.companyName = innInfo.name;

        const newSalesman = await Salesman.create(req.body);
        res.status(201).json(newSalesman);
    } catch (err) {
        console.error('Ошибка при создании Salesman:', err);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при создании продавца', error: err.message });
    }
};

export const getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await Salesman.find();
        res.json(salesmen);
    } catch (err) {
        console.error('Ошибка при получении списка Salesmen:', err);
        res.status(500).json({ message: 'Ошибка сервера при получении списка продавцов', error: err.message });
    }
};

export const getSalesmanById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Неверный ID продавца' });
        }

        const salesman = await Salesman.findById(id);
        if (!salesman) {
            return res.status(404).json({ message: 'Продавец не найден' });
        }

        res.json(salesman);
    } catch (err) {
        console.error('Ошибка при получении Salesman по ID:', err);
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

export const updateSalesman = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Неверный ID продавца' });
        }

        const { error } = salesmanValidations.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedSalesman = await Salesman.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSalesman) {
            return res.status(404).json({ message: 'Продавец не найден' });
        }

        res.json(updatedSalesman);
    } catch (err) {
        console.error('Ошибка при обновлении Salesman:', err);
        res.status(500).json({ message: 'Ошибка сервера при обновлении', error: err.message });
    }
};

export const deleteSalesman = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Неверный ID продавца' });
        }

        await Auction.updateMany(
            { salesman: id },
            { $unset: { salesman: "" } }
        );

        const deletedSalesman = await Salesman.findByIdAndDelete(id);
        if (!deletedSalesman) {
            return res.status(404).json({ message: 'Продавец не найден' });
        }

        res.json({ message: 'Продавец успешно удалён, ссылки в аукционах очищены' });
    } catch (err) {
        console.error('Ошибка при удалении Salesman:', err);
        res.status(500).json({ message: 'Ошибка сервера при удалении', error: err.message });
    }
};