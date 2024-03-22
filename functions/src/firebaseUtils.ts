/* eslint-disable max-len */
import * as admin from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import {Request, Response} from "firebase-functions";

admin.initializeApp();

export const firebaseUtils = {
  store: admin.firestore(),
  auth: getAuth(),
  storage: admin.storage(),
  getFireStorDel: admin.firestore.FieldValue.delete,
  setCommonHeaders: (request:Request, response:Response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    if (request.method == "OPTIONS") {
      response.send("OK");
      return false;
    }

    return true;
  },
  checkAuthentication: async (request:Request, response: Response) => {
    // Extract the token from the Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(403).send("Unauthorized");
      return;
    }
    const token = authHeader.split("Bearer ")[1];

    try {
      // Verify the token using Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      // Add the decoded user to the request object
      return decodedToken;
    } catch (error) {
      // Handle error
      console.error("Error verifying Firebase token:", error);
      response.status(403).send("Unauthorized");
      return;
    }
  },
};
