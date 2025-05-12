import { Bid } from '../Models/BidModels.js';
import { Auction } from '../Models/AuctionModels.js';
import { setupBiddingSocket } from '../Sockets/bid.socket.js';
import { bidSchema } from '../Validations/BidValidation.js';

const extendAuctionIfNeeded = (auction) => {
    const now = new Date();
    const timeLeft = new Date(auction.endTime) - now;

    if (timeLeft < 15 * 60 * 1000) {
        auction.endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    }

    return auction;
};

const emitBidSocket = (auctionId, price, winnerName, endTime) => {
    setupBiddingSocket.to(auctionId).emit('newBid', {
        auctionId,
        currentPrice: price,
        winner: winnerName,
        endTime
    });
};

const handleAutoBids = async (auction, userId) => {
    const autoBidders = await Bid.find({
        auctionId: auction._id,
        isAutoBid: true,
        userId: { $ne: userId }
    });

    for (const auto of autoBidders) {
        if (auto.maxAutoBidAmount > auction.currentPrice) {
            const increment = 100;
            const nextAmount = Math.min(auto.maxAutoBidAmount, auction.currentPrice + increment);

            await Bid.create({
                auctionId: auction._id,
                userId: auto.userId,
                amount: nextAmount,
                isAutoBid: true,
                maxAutoBidAmount: auto.maxAutoBidAmount,
                createdAt: new Date()
            });

            auction.currentPrice = nextAmount;
            auction.winner = auto.userId;
            await auction.save();

            emitBidSocket(auction._id, nextAmount, 'AutoBid', auction.endTime);
            break;
        }
    }
};


export const placeBid = async (req, res) => {
    try {
        const { auctionId, amount, isAutoBid, maxAutoBidAmount } = await bidSchema.validateAsync(req.body);
        const userId = req.user._id;

        const auction = await Auction.findById(auctionId);
        if (!auction || auction.status !== 'active') {
            return res.status(400).json({ message: 'Аукцион недоступен для ставок' });
        }

        if (amount <= auction.currentPrice) {
            return res.status(400).json({ message: 'Ставка должна быть выше текущей цены' });
        }

        const newBid = await Bid.create({
            auctionId,
            userId,
            amount,
            isAutoBid,
            maxAutoBidAmount,
            createdAt: new Date()
        });

        auction.currentPrice = amount;
        auction.winner = userId;
        extendAuctionIfNeeded(auction);
        await auction.save();

        emitBidSocket(auctionId, amount, req.user.name, auction.endTime);
        await handleAutoBids(auction, userId);

        res.status(201).json(newBid);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getBidsByAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bids = await Bid.find({ auctionId }).sort({ createdAt: -1 });
        res.status(200).json(bids);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

export const adminDeleteBid = async (req, res) => {
    try {
        await Bid.findByIdAndDelete(req.params.bidId);
        res.json({ message: 'Ставка удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления', error: err.message });
    }
};

export const adminUpdateBid = async (req, res) => {
    try {
        const updated = await Bid.findByIdAndUpdate(req.params.bidId, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка обновления', error: err.message });
    }
};


export const adminCreateBid = async (req, res) => {
    const newBid = await Bid.create(req.body);
    res.status(201).json(newBid);
};