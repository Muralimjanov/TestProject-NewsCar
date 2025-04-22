import express from 'express';
import cors from 'cors';
import newsCarRoutes from './Routes/newsCarRoutes.js';
import newsInterestingRoutes from './Routes/newsInterestingRoutes.js';
import newsExclusiveRoutes from './Routes/newsExclusiveRoutes.js';
import newsAdviceRoutes from './Routes/newsAdviceRoutes.js';
import { connectDB } from './config/dbConnect.js';
import { app } from './config/dbConnect.js';

connectDB();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use('/api/new-cars', newsCarRoutes);
app.use('/api/news-interesting', newsInterestingRoutes);
app.use('/api/news-exclusive', newsExclusiveRoutes);
app.use('/api/news-advice', newsAdviceRoutes);