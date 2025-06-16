import { Auction } from '../Models/AuctionModels.js';
import { Deal } from '../Models/DealModels.js';
import { User } from '../Models/UserModels.js';

export const finalizeAuctions = async () => {
    try {
        const now = new Date();

        const startingAuctions = await Auction.find({
            startTime: { $lte: now },
            endTime: { $gt: now },
            status: 'upcoming'
        });

        for (const auction of startingAuctions) {
            auction.status = 'active';
            await auction.save();
            console.log(`Аукцион ${auction._id} стал активным.`);
        }

        const expiredAuctions = await Auction.find({
            endTime: { $lte: now },
            status: 'active',
            winner: { $ne: null }
        });

        for (const auction of expiredAuctions) {
            auction.status = 'ended';
            await auction.save();

            const deal = await Deal.create({
                auctionId: auction._id,
                buyerId: auction.winner,
                finalPrice: auction.currentPrice
            });

            await User.findByIdAndUpdate(auction.winner, {
                $addToSet: {
                    winningAuctions: auction._id,
                    deals: deal._id
                }
            });

            console.log(`Аукцион ${auction._id} завершён. Сделка создана, пользователь обновлен.`);
        }


    } catch (err) {
        console.error('Ошибка при обновлении аукционов:', err.message);
    }
};
