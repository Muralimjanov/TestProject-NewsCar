import { Schema, model } from 'mongoose';
import { Auction } from './AuctionModels.js';

const salesmanSchema = new Schema({
    companyName: {
        type: String,
        equired: true
    },
    city: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    inn: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    documentsLink: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

salesmanSchema.pre('findOneAndDelete', async function (next) {
    try {
        const salesmanId = this.getQuery()._id;

        await Auction.updateMany(
            { salesman: salesmanId },
            { $unset: { salesman: "" } }
        );

        next();
    } catch (err) {
        next(err);
    }
});

export const Salesman = model('Salesman', salesmanSchema);
