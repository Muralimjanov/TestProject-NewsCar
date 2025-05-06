import { Bid } from '../Models/BidModels.js';
import { Auction } from '../Models/AuctionModels.js';
import { setupBiddingSocket } from '../Sockets/bid.socket.js';

export const placeBid = async (req, res) => {
    try {
        const validated = await bidSchema.validateAsync(req.body);
        const { auctionId, amount, isAutoBid, maxAutoBidAmount } = validated;
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

        const now = new Date();
        const timeLeft = new Date(auction.endTime) - now;
        if (timeLeft < 15 * 60 * 1000) {
            auction.endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        }

        await auction.save();

        setupBiddingSocket.to(auctionId).emit('newBid', {
            auctionId,
            currentPrice: amount,
            winner: req.user.name,
            endTime: auction.endTime
        });

        const autoBidders = await Bid.find({
            auctionId,
            isAutoBid: true,
            userId: { $ne: userId }
        });

        for (let auto of autoBidders) {
            if (auto.maxAutoBidAmount > auction.currentPrice) {
                const increment = 100;
                const nextAmount = Math.min(auto.maxAutoBidAmount, auction.currentPrice + increment);
                const botBid = await Bid.create({
                    auctionId,
                    userId: auto.userId,
                    amount: nextAmount,
                    isAutoBid: true,
                    maxAutoBidAmount: auto.maxAutoBidAmount,
                    createdAt: new Date()
                });

                auction.currentPrice = nextAmount;
                auction.winner = auto.userId;
                await auction.save();

                setupBiddingSocket.to(auctionId).emit('newBid', {
                    auctionId,
                    currentPrice: nextAmount,
                    winner: `AutoBid`,
                    endTime: auction.endTime
                });
                break;
            }
        }

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
    await Bid.findByIdAndDelete(req.params.bidId);
    res.json({ message: 'Ставка удалена' });
};

export const adminUpdateBid = async (req, res) => {
    const updated = await Bid.findByIdAndUpdate(req.params.bidId, req.body, { new: true });
    res.json(updated);
};

export const adminCreateBid = async (req, res) => {
    const newBid = await Bid.create(req.body);
    res.status(201).json(newBid);
};