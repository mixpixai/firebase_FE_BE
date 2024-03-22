/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {firebaseUtils} from "../firebaseUtils";
import {getUserOrCreate} from "../userService/user.service";
import {ComfyUIRequest, WorkflowType} from "../aiService/ai.types";
import {aiService} from "../aiService/ai.service";
import {storageService} from "../storageService/sotrage.service";

const modelCollectionPath = "models";
const defaultModelInstaUserName = "vihana_adani";

export interface ModelUserData {
   instaUserName: string,
   facePhoto_base64: string|null,
   tosTS: number|null,
   isLive: boolean,
   isVerified: boolean,
   verificationStatus: "notStarted"| "inProgress" | "complete",
   verificationObject?: VerificationObject,
   verificationCode: string,
   compositeCode:string,
   publicURL?:string,
   uid: string,
}

interface VerificationObject {
  faceMatch: boolean,
  properHeadShot: boolean,
  establishedProfile: boolean,
  isAIModel: boolean,
  other: string| null,
}

const getActiveModelByInstaId = async (instaUserName: string) => {
  const collectionRef = firebaseUtils.store.collection(modelCollectionPath);
  const query = collectionRef.where("instaUserName", "==", instaUserName);

  const querySnapShot = await query.get();
  if (querySnapShot.empty) {
    return null;
  }
  const doc = querySnapShot.docs.map((o) => o.data() as ModelUserData).filter((o) => o.isVerified && o.isLive);

  const retDoc = doc[0];
  return retDoc;
};

const getActiveOrDefaultModel = async (instaUserName: string) => {
  const activeModel = await getActiveModelByInstaId(instaUserName);
  if (activeModel) {
    return activeModel;
  }

  const defaultModel = await getActiveModelByInstaId(defaultModelInstaUserName);
  return defaultModel;
};

export const modelService = {

  getActiveOrDefaultModel,

  // POST {facePic:string, instaUserName:string}
  addModel: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    try {
      const {facePic, instaUserName} = req.body;
      const verificationCode = generateRandomString(10);
      const compositeCode = `${firUser.uid}|${verificationCode}`;
      const newDocData:ModelUserData = {
        instaUserName: instaUserName,
        facePhoto_base64: facePic,
        tosTS: Date.now(),
        isLive: false,
        isVerified: false,
        verificationCode: generateRandomString(10),
        compositeCode,
        verificationStatus: "notStarted",
        uid: firUser.uid,
      };
      // TODO check for duplicate
      // TODO add facePic to server
      const newDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${firUser.uid}`);
      await newDocRef.set(newDocData);
      res.send(newDocData);
    } catch (error:any) {
      console.error(`Error in addModel ${error.message}`);
      res.status(500).send({error: error.message});
    }
  },

  getModelData: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    const userDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${firUser.uid}`);
    const userSnapShot = await userDocRef.get();
    if (!userSnapShot.exists) {
      res.send({});
    }
    const data = userSnapShot.data();
    res.send(data);
  },

  // GET call
  deleteUserModels: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }
    // TODO overwrite the image on the server too.

    // delete from R2
    await storageService.deleteFaceImage(firUser.uid);
    const userDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${firUser.uid}`);
    await userDocRef.delete();
    res.send({status: "success"});
  },

  getModelUserAsAdmin: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }
    const appUser = await getUserOrCreate(firUser);
    if (!appUser.user.isAdmin) {
      res.status(404).send({"error": "User is not Admin"});
    }
    try {
      const {compositeCode, userName} = req.body;
      const modelUid = compositeCode.split("|")[0];

      const userDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${modelUid}`);
      const userSnapShot = await userDocRef.get();

      if (!userSnapShot.exists) {
        throw new Error("User doesn't exist");
      }

      const userData = userSnapShot.data() as ModelUserData;
      if (userData.compositeCode !== compositeCode) {
        throw new Error("Code Mismatch");
      }

      if (userData.instaUserName !== userName) {
        throw new Error("UserName Mismatch");
      }

      res.send(userData);
    } catch (error:any) {
      res.status(400).send({error: error.message});
    }
  },

  verifyUser: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }
    const appUser = await getUserOrCreate(firUser);
    if (!appUser.user.isAdmin) {
      res.status(404).send({"error": "User is not Admin"});
    }

    try {
      const {modelUid, verificationObject} = req.body as {modelUid:string, verificationObject: VerificationObject};
      const userDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${modelUid}`);
      const userDS = await userDocRef.get();
      if (!userDS.exists) {
        throw new Error("user doesn't exist");
      }
      const isVerified =
      verificationObject.establishedProfile &&
      verificationObject.faceMatch &&
      verificationObject.isAIModel &&
      verificationObject.properHeadShot &&
      !verificationObject.other;

      const verificationStatus = "complete";

      // upload faceImage to Runpod
      const modelData = userDS.data() as ModelUserData;

      let publicURL = "";

      if (isVerified) {
        const faceImage = modelData.facePhoto_base64 as string;
        const uploadFaceImageRequest : ComfyUIRequest = {
          workflow: WorkflowType.onboardModel,
          faceImage,
          modelId: modelUid,
        };
        await aiService.executeComfyUIWorkflow(uploadFaceImageRequest, modelUid);
        publicURL = await storageService.uploadFaceImage(modelData.uid, faceImage);
      }
      await userDocRef.update({isVerified, verificationObject, verificationStatus, isLive: true, publicURL});
      const postUserDS = await userDocRef.get();

      if (!postUserDS.exists) {
        res.send({});
        return;
      }
      res.send(postUserDS.data());
    } catch (error: any) {
      res.status(500).send({error: error.message});
    }
  },

  // POST {isLive: true|false}
  updateGoLive: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    const isLive = req.body.isLive;

    const userDocRef = firebaseUtils.store.doc(`${modelCollectionPath}/${firUser.uid}`);
    await userDocRef.update({isLive});
    const userDS = await userDocRef.get();
    res.send(userDS.data());
  },

  getLiveModels: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }
    const collectionRef = firebaseUtils.store.collection(modelCollectionPath);
    const query = collectionRef.where("isLive", "==", true);

    const querySnapShot = await query.get();
    if (querySnapShot.empty) {
      res.send([]);
    }
    const liveModels = querySnapShot.docs
        .map((o) => o.data() as ModelUserData)
        .filter((o) => o.isVerified && o.isLive)
        .map((o) => {
          return {uid: o.uid, instaUserName: o.instaUserName, publicURL: o.publicURL};
        });
    res.send(liveModels);
  },
};

const generateRandomString = (len:number) => {
  // Define the character set
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Initialize an empty string for the result
  let result = "";

  // Randomly pick characters from the chars string
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

