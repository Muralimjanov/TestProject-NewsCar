import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from 'config';
import bodyParser from 'body-parser';
import newCarRoutes from './Routes/newCarRoutes.js';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const PORT = config.get('serverPort');

app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb" }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.use('/api/new-cars', newCarRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(config.get('mongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
        server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error('Server start error:', err);
    }
}

connectDB();