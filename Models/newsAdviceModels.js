import { Schema, model } from 'mongoose';

const newsAdviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    mainText: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const NewsAdvice = model('NewsAdvice', newsAdviceSchema);
