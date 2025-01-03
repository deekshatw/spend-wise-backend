// import axios from "axios";
// import { GoogleAuth } from "google-auth-library";

// console.log("Notification service is running", process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
// // Read the service account key JSON from an environment variable
// const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
// const PROJECT_ID = "spend-wise-465a0";

// // FCM endpoint for sending messages
// const FCM_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

// console.log(serviceAccountKey);


// // Get a Bearer token using GoogleAuth
// const getAccessToken = async (): Promise<string> => {
//     const auth = new GoogleAuth({
//         credentials: serviceAccountKey, // Use credentials directly from the environment variable
//         scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
//     });

//     const client = await auth.getClient();
//     const accessToken = await client.getAccessToken();

//     if (!accessToken) {
//         throw new Error("Failed to retrieve access token");
//     }

//     if (!accessToken.token) {
//         throw new Error("Failed to retrieve access token");
//     }
//     return accessToken.token;
// };

// // Define the shape of the optional data payload
// interface NotificationData {
//     [key: string]: string;
// }

// // Function to send a notification
// export const sendNotification = async (
//     token: string,
//     title: string,
//     body: string,
//     data: NotificationData = {}
// ): Promise<boolean> => {
//     try {
//         const accessToken = await getAccessToken();

//         const message = {
//             message: {
//                 token: token,
//                 notification: {
//                     title: title,
//                     body: body,
//                 },
//                 data: data,
//             },
//         };

//         const response = await axios.post(FCM_URL, message, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         console.log(response.data);

//         return true;
//     } catch (error: any) {
//         console.error("Error sending notification:", error.response?.data || error.message);
//         return false;
//     }
// };
