import { Schema, model } from 'mongoose';

const newsInterestingSchema = new Schema({
    header: {
        type: String,
        required: true
    },
    preview: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        required: true
    },
    images: [{ type: String }],
    tags: [{
        type: String,
        maxlength: 15
    }],
    views: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        maxlength: 70,
        required: true
    }
});

export const newsInterestingModels = model('NewsInteresting', newsInterestingSchema);
