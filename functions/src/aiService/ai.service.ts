/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
import {firebaseUtils} from "../firebaseUtils";
import {ComfyUIRequest} from "./ai.types";
import * as fetch from "node-fetch";
import {getWorkflowPayload} from "./workflow";
import {mockResponse} from "./mock_response";

const executeComfyUIWorkflow = async (payload: ComfyUIRequest, uid: string) => {
  const url = process.env.RUNPOD_API_ENDPOINT as string;
  const postReqPayload = await getWorkflowPayload(payload, uid);
  console.log(JSON.stringify(postReqPayload));

  // TODO move this to secret
  const bearerToken = process.env.RUNPOD_SECRET as string;
  console.log(url);
  console.log(bearerToken);
  const response:{output?:{message?: string}} = await makePostRequest(url, postReqPayload, bearerToken);

  return {image: response.output?.message ?? "no Image"};
};

export const aiService = {
  generateImage: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    // TODO check that there is only one request for this user at a time.
    // Maybe rate limiting ?

    try {
      const payload:ComfyUIRequest = req.body;
      const result = await executeComfyUIWorkflow(payload, firUser.uid);

      res.send(result);
    } catch (error) {
      functions.logger.error(firUser.uid, `[uid: ${firUser.uid}] ${error}`);
      res.status(500).send(error);
    }
  },
  generateMockImage: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    res.send(mockResponse);
  },
  executeComfyUIWorkflow,
};

const makePostRequest = async (url:string, postData:any, bearerToken: string) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    // check for response.status
    const responseData = await response.json();
    console.log("Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error making post request:", error);
    return error;
  }
};

