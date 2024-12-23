import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import helloRouter from './routes/hello.routes';
import { router } from './routes/routes';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

// Express configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'localhost';
const MONGO_URI = process.env.MONGO_DB_URL;

if (!MONGO_URI) {
    console.error("MongoDB connection string not found in environment variables.");
    process.exit(1);
}

// Defining routes
app.use("/api/v1", router);

// MongoDB connection
mongoose.connect(MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });

// Start the server
try {
    server.listen(PORT, () => {
        console.log(`Server running at http://${BASE_URL}:${PORT}`);
    });
} catch (err) {
    console.error("Error starting the server:", err);
}
if (module.hot) {
    module.hot.accept('./some-module', () => {
        console.log('Module updated!');
    });

    module.hot.dispose(() => {
        console.log('Cleaning up before disposing...');
    });
}


export default server;
