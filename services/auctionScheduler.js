import { Auction } from '../Models/AuctionModels.js';
import { Deal } from '../Models/DealModels.js';

export const finalizeAuctions = async () => {
    try {
        const now = new Date();

        const expiredAuctions = await Auction.find({
            endTime: { $lte: now },
            status: 'active',
            winner: { $ne: null }
        });

        for (const auction of expiredAuctions) {
            auction.status = 'ended';
            await auction.save();

            await Deal.create({
                auctionId: auction._id,
                buyerId: auction.winner,
                finalPrice: auction.currentPrice
            });

            console.log(`Аукцион ${auction._id} завершён. Сделка создана.`);
        }
    } catch (err) {
        console.error('Ошибка при завершении аукционов:', err.message);
    }
};
