/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {userService} from "./userService/user.service";
import {aiService} from "./aiService/ai.service";
import {modelService} from "./modelService/model.service";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest( async (_request, response) => {
  functions.logger.info("Making a GET request", {structuredData: true});
  response.send("hello");
});

export const getUser = functions.https.onRequest(userService.getUser);
export const getUserAndModel = functions.runWith({
  minInstances: 1,
}).https.onRequest(userService.getUserAndModel);
export const updateTOSStatus = functions.https.onRequest(userService.updateTOSStatus);
export const generateImage = functions.runWith({
  minInstances: 1,
}).https.onRequest(aiService.generateImage);
export const getLiveModels = functions.runWith({
  minInstances: 1,
}).https.onRequest(modelService.getLiveModels);
export const generateMockImage = functions.https.onRequest(aiService.generateMockImage);

export const addModel = functions.https.onRequest(modelService.addModel);
export const deleteUserModels = functions.https.onRequest(modelService.deleteUserModels);
export const updateGoLive = functions.https.onRequest(modelService.updateGoLive);
export const getModelData = functions.https.onRequest(modelService.getModelData);
export const getModelUserAsAdmin = functions.https.onRequest(modelService.getModelUserAsAdmin);
export const verifyUser = functions.https.onRequest(modelService.verifyUser);

export const generateTestLoginToken = functions.https.onRequest(userService.generateTestLoginToken);
