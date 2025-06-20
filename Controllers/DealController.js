import fs from 'fs/promises';
import { Deal } from '../Models/DealModels.js';
import { generateDealPDF } from '../utils/generateDealPDF.js';
import { sendDealEmail } from '../utils/sendDealEmail.js';


export const getAllDeals = async (req, res) => {
    try {
        const deals = await Deal.find().populate('auctionId buyerId');
        res.json(deals);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

export const getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).populate('auctionId buyerId');
        if (!deal) {
            return res.status(404).json({ message: 'Сделка не найдена' });
        }
        res.json(deal);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

export const createDeal = async (req, res) => {
    try {
        const newDeal = await Deal.create(req.body);

        const populatedDeal = await Deal.findById(newDeal._id)
            .populate('auctionId buyerId');

        console.log('Создаётся PDF для сделки:', populatedDeal);

        const pdfPath = `./docs/deal-${newDeal._id}.pdf`;
        await generateDealPDF(populatedDeal, pdfPath);

        await sendDealEmail(populatedDeal.buyerId.email, 'Сделка завершена', 'Ваша сделка завершена. Смотрите вложение.', pdfPath);

        res.status(201).json(newDeal);
    } catch (err) {
        console.error('Ошибка в createDeal:', err);
        res.status(400).json({ message: 'Ошибка при создании сделки', error: err.message });
    }
};

export const deleteDeal = async (req, res) => {
    try {
        await Deal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Сделка удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при удалении', error: err.message });
    }
};

export const downloadDealDocuments = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).populate('auctionId buyerId');
        if (!deal) {
            return res.status(404).json({ message: 'Сделка не найдена' });
        }

        const pdfPath = `./docs/deal-${deal._id}.pdf`;

        try {
            await fs.access(pdfPath);
        } catch {
            await generateDealPDF(deal, pdfPath);
        }

        res.download(pdfPath);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при загрузке документа', error: err.message });
    }
};

export const updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(req.params.dealId, req.body, {
            new: true,
        });
        if (!deal) {
            return res.status(404).json({ message: "Сделка не найдена" });
        }
        res.json(deal);
    } catch (err) {
        res.status(500).json({ message: "Ошибка обновления сделки", error: err.message });
    }
};
