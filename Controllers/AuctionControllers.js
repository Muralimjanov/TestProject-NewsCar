import { Auction } from '../Models/AuctionModels.js';

export const createAuction = async (req, res) => {
    try {
        const auction = new Auction(req.body);
        await auction.save();
        res.status(201).json(auction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find().sort({ createdAt: -1 });
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateAuction = async (req, res) => {
    try {
        const updated = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAuction = async (req, res) => {
    try {
        const deleted = await Auction.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json({ message: 'Auction deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const bulkCreate = async (req, res) => {
    try {
        const created = await Auction.insertMany(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const bulkUpdate = async (req, res) => {
    try {
        const updates = req.body;
        const results = await Promise.all(updates.map(item =>
            Auction.findByIdAndUpdate(item._id, item, { new: true })
        ));
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const bulkDelete = async (req, res) => {
    try {
        const ids = req.body;
        await Auction.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Auctions deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const createManyAuctions = async (req, res) => {
    try {
        const auctions = await Auction.insertMany(req.body);
        res.status(201).json({ message: 'Auctions created', data: auctions });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateManyAuctions = async (req, res) => {
    try {
        const updates = req.body;

        const results = await Promise.all(updates.map(async (item) => {
            return await Auction.findByIdAndUpdate(
                item.id,
                item.data,
                { new: true }
            );
        }));

        res.status(200).json({ message: 'Auctions updated', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteManyAuctions = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await Auction.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Auctions deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
