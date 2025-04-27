import mongoose from 'mongoose';
import config from 'config';

const MONGO_URL = config.get('mongoURL');

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};
