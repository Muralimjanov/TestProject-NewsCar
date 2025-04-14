import mongoose from 'mongoose';
import config from 'config';
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const PORT = config.get('serverPort');
const MONGO_URL = config.get('mongoURL');

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected');

        server.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Server start error:', err.message);
        process.exit(1);
    }
};

export { app, server };
