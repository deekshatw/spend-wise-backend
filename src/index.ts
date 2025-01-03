import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router } from './routes/routes';

dotenv.config(); // Load environment variables

const app: Express = express();
const server = http.createServer(app);

// Express configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("PORT", process.env.PORT || 3000);

// Define routes
app.use("/api/v1", router);

// MongoDB connection
const mongoURI = process.env.MONGO_DB_URL;

if (!mongoURI) {
    console.error("MongoDB connection string not found");
    process.exit(1);
}

// Start the server only after MongoDB connection
mongoose.connect(mongoURI, {})
    .then(() => {
        console.log("MongoDB connected");

        // Start the server after MongoDB connection
        const port: number = app.get("PORT");
        server.listen(port, () => {
            console.log(`Server running at port:${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit if MongoDB connection fails
    });

export default server;
