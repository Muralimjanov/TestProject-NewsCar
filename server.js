import express from 'express';
import cors from 'cors';
import config from 'config';
import { createServer } from 'http';
import { connectDB } from './config/dbConnect.js';

import newsCarRoutes from './Routes/newsCarRoutes.js';
import newsInterestingRoutes from './Routes/newsInterestingRoutes.js';
import newsExclusiveRoutes from './Routes/newsExclusiveRoutes.js';
import newsAdviceRoutes from './Routes/newsAdviceRoutes.js';
import newsAuthRoutes from './Routes/newsAuthRoutes.js';

const app = express();
const server = createServer(app);
const PORT = config.get('serverPort');

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use('/api/auth', newsAuthRoutes);
app.use('/api/new-cars', newsCarRoutes);
app.use('/api/news-interesting', newsInterestingRoutes);
app.use('/api/news-exclusive', newsExclusiveRoutes);
app.use('/api/news-advice', newsAdviceRoutes);

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
};

startServer();
