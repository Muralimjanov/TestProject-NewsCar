import { Schema, model, Types } from 'mongoose';

const auctionSchema = new Schema({
    carName: {
        type: String,
        required: true
    },
    lotNumber: String,
    carImageUrls: [String],
    year: Number,
    mileage: Number,
    steering: String,
    maxSpeed: Number,
    cylinders: Number,
    originCountry: String,
    horsepower: Number,

    startPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'ended'],
        default: 'upcoming'
    },
    winner: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Auction = model('Auction', auctionSchema);
