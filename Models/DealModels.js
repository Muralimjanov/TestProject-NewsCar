import { Schema, Types, model } from 'mongoose';

const dealSchema = new Schema({
    auctionId: {
        type: Types.ObjectId,
        ref: 'Auction',
        required: true,
        unique: true
    },
    buyerId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'unpaid', 'paid'],
        default: 'processing'
    },
    documents: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

export const Deal = model('Deal', dealSchema);
