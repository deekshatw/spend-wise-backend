"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes/routes");
dotenv.config(); // Load environment variables
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Express configurations
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set("PORT", process.env.PORT || 3000);
// Define routes
app.use("/api/v1", routes_1.router);
// MongoDB connection
const mongoURI = process.env.MONGO_DB_URL;
if (!mongoURI) {
    console.error("MongoDB connection string not found");
    process.exit(1);
}
mongoose_1.default.connect(mongoURI, {}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if MongoDB connection fails
});
// Start the server
try {
    const port = app.get("PORT");
    server.listen(port, () => {
        console.log(`Server running at port:${port}`);
    });
}
catch (err) {
    console.error("Error starting server:", err);
}
exports.default = server;
