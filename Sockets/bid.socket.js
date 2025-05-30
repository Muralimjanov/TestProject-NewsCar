import { Server } from 'socket.io';
import { Auction } from '../Models/AuctionModels.js';

let io;

export const setupBiddingSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join_auction', (auctionId) => {
            socket.join(auctionId);
        });

        socket.on('place_bid', async ({ auctionId, userId, amount }) => {
            try {
                const auction = await Auction.findById(auctionId);
                if (!auction || auction.status !== 'active') {
                    return socket.emit('bid_error', 'Auction not found or not active');
                }

                if (amount <= auction.currentPrice) {
                    return socket.emit('bid_error', 'Bid must be higher than current price');
                }

                auction.currentPrice = amount;
                auction.winner = userId;
                await auction.save();

                io.to(auctionId).emit('new_bid', {
                    amount,
                    userId,
                    auctionId
                });
            } catch (err) {
                console.error(err);
                socket.emit('bid_error', 'Server error');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export const getIO = () => io;
