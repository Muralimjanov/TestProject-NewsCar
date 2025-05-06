import { Schema, model } from 'mongoose';

const newsExclusiveSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    specifications: {
        type: Object,
        required: true,
    },
    advantages: [
        {
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
        },
    ],
});

export const NewsExclusive = model('NewsExclusive', newsExclusiveSchema);