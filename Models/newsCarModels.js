import { model, Schema } from "mongoose";

const NewsCarSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    engineType: {
        type: String,
        required: true
    },
    horsePower: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        default: []
    }
});

export const NewsCar = model("NewsCar", NewsCarSchema);