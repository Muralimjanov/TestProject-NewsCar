import { Bid } from "../Models/BidModels.js";
import { Auction } from "../Models/AuctionModels.js";
import { getIO } from "../Sockets/bid.socket.js";
import { bidSchema } from "../Validations/BidValidation.js";
import { User } from "../Models/UserModels.js";

const extendAuctionIfNeeded = (auction) => {
  const now = new Date();
  const timeLeft = new Date(auction.endTime) - now;

  if (timeLeft < 15 * 60 * 1000) {
    auction.endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  }

  return auction;
};

const emitBidSocket = (auctionId, price, winnerName, endTime) => {
  const io = getIO();
  if (io) {
    io.to(auctionId).emit("newBid", {
      auctionId,
      currentPrice: price,
      winner: winnerName,
      endTime,
    });
  }
};

const handleAutoBids = async (auction) => {
  let hasChanged = true;

  while (hasChanged) {
    hasChanged = false;

    const autoBidders = await Bid.find({
      auctionId: auction._id,
      isAutoBid: true,
    });

    autoBidders.sort((a, b) => b.maxAutoBidAmount - a.maxAutoBidAmount);

    for (const auto of autoBidders) {
      if (auto.userId.toString() === auction.winner?.toString()) {
        continue;
      }

      if (auto.maxAutoBidAmount > auction.currentPrice) {
        const increment = 100;
        const nextAmount = Math.min(
          auto.maxAutoBidAmount,
          auction.currentPrice + increment
        );

        await Bid.create({
          auctionId: auction._id,
          userId: auto.userId,
          amount: nextAmount,
          isAutoBid: true,
          maxAutoBidAmount: auto.maxAutoBidAmount,
          createdAt: new Date(),
        });

        auction.currentPrice = nextAmount;
        auction.winner = auto.userId;
        await auction.save();

        await User.findByIdAndUpdate(auto.userId, {
          $addToSet: {
            winningAuctions: auction._id,
          },
        });

        emitBidSocket(auction._id, nextAmount, "AutoBid", auction.endTime);

        hasChanged = true;
        break;
      }
    }
  }
};

const createBidAndUpdateAuction = async ({
  auctionId,
  userId,
  amount,
  isAutoBid = false,
  maxAutoBidAmount = 0,
  winnerName = "",
  overrideStatusCheck = false,
}) => {
  const auction = await Auction.findById(auctionId);
  if (!auction || (!overrideStatusCheck && auction.status !== "active")) {
    throw new Error("Аукцион недоступен для ставок");
  }

  if (amount <= auction.currentPrice) {
    throw new Error("Ставка должна быть выше текущей цены");
  }

  const newBid = await Bid.create({
    auctionId,
    userId,
    amount,
    isAutoBid,
    maxAutoBidAmount,
    createdAt: new Date(),
  });

  auction.currentPrice = amount;
  auction.winner = userId;
  extendAuctionIfNeeded(auction);
  await auction.save();

  emitBidSocket(auctionId, amount, winnerName, auction.endTime);
  await handleAutoBids(auction, userId);

  return newBid;
};

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount, isAutoBid, maxAutoBidAmount } =
      await bidSchema.validateAsync(req.body);
    const userId = req.user._id;
    const winnerName = req.user.name;

    const newBid = await createBidAndUpdateAuction({
      auctionId,
      userId,
      amount,
      isAutoBid,
      maxAutoBidAmount,
      winnerName,
    });

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
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
};

export const adminDeleteBid = async (req, res) => {
  try {
    await Bid.findByIdAndDelete(req.params.bidId);
    res.json({ message: "Ставка удалена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления", error: err.message });
  }
};

export const adminUpdateBid = async (req, res) => {
  try {
    const updated = await Bid.findByIdAndUpdate(req.params.bidId, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления", error: err.message });
  }
};

export const adminCreateBid = async (req, res) => {
  try {
    const { auctionId, amount, isAutoBid, maxAutoBidAmount, userId, name } =
      req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId обязателен для админской ставки" });
    }

    const newBid = await createBidAndUpdateAuction({
      auctionId,
      userId,
      amount,
      isAutoBid,
      maxAutoBidAmount,
      winnerName: name || "admin",
      overrideStatusCheck: true,
    });

    res.status(201).json(newBid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
