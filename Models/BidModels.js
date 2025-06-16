import { Schema, model, Types } from 'mongoose';

const bidSchema = new Schema({
    auctionId: {
        type: Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isAutoBid: {
        type: Boolean,
        default: false
    },
    maxAutoBidAmount: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Bid = model('Bid', bidSchema);
