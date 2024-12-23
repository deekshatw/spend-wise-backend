"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const axios_1 = __importDefault(require("axios"));
const google_auth_library_1 = require("google-auth-library");
console.log("Notification service is running", process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
// Read the service account key JSON from an environment variable
const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
const PROJECT_ID = "spend-wise-465a0";
// FCM endpoint for sending messages
const FCM_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;
console.log(serviceAccountKey);
// Get a Bearer token using GoogleAuth
const getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new google_auth_library_1.GoogleAuth({
        credentials: serviceAccountKey, // Use credentials directly from the environment variable
        scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });
    const client = yield auth.getClient();
    const accessToken = yield client.getAccessToken();
    if (!accessToken) {
        throw new Error("Failed to retrieve access token");
    }
    if (!accessToken.token) {
        throw new Error("Failed to retrieve access token");
    }
    return accessToken.token;
});
// Function to send a notification
const sendNotification = (token_1, title_1, body_1, ...args_1) => __awaiter(void 0, [token_1, title_1, body_1, ...args_1], void 0, function* (token, title, body, data = {}) {
    var _a;
    try {
        const accessToken = yield getAccessToken();
        const message = {
            message: {
                token: token,
                notification: {
                    title: title,
                    body: body,
                },
                data: data,
            },
        };
        const response = yield axios_1.default.post(FCM_URL, message, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);
        return true;
    }
    catch (error) {
        console.error("Error sending notification:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return false;
    }
});
exports.sendNotification = sendNotification;
