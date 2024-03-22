/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {firebaseUtils} from "../firebaseUtils";
import {AppUser} from "./user.types";
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {modelService} from "../modelService/model.service";

// will get the user and create one if not found
export const getUserOrCreate = async (firUser: DecodedIdToken) => {
// check if the user exists in firestore
  const store = firebaseUtils.store;
  const userDocRef = store.doc(`users/${firUser.uid}`);
  const userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const user = userDoc.data() as AppUser;
    return {user, userDocRef};
  }

  // create a new user
  const user: AppUser = {
    name: firUser.name ?? "NO NAME",
    email: firUser.email ?? "NO EMAIL",
    phone: firUser.phone_number ?? "NO_PHONE",
    id: firUser.uid,
    ts: Date.now(),
    lut: Date.now(),
    tosTS: null,
  };
  await userDocRef.set(user);
  return {user, userDocRef};
};

export const userService = {
  getUser: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    try {
      const {user} = await getUserOrCreate(firUser);
      res.send(user);
    } catch (error) {
      functions.logger.error(firUser.uid, `[uid: ${firUser.uid}] ${error}`);
      res.status(500).send(error);
    }
  },

  getUserAndModel: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    try {
      const {user} = await getUserOrCreate(firUser);
      const modelInstaHandle = req.query.instaUserName as string ?? "vihana_adani";
      const model = await modelService.getActiveOrDefaultModel(modelInstaHandle);
      res.send({user, model: {uid: model?.uid, instaUserName: model?.instaUserName, publicURL: model?.publicURL}});
    } catch (error) {
      functions.logger.error(firUser.uid, `[uid: ${firUser.uid}] ${error}`);
      res.status(500).send(error);
    }
  },

  updateTOSStatus: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }
    const firUser = await firebaseUtils.checkAuthentication(req, res);
    if (!firUser) {
      return;
    }

    try {
      const {user, userDocRef} = await getUserOrCreate(firUser);
      const tosVal = req.body.acceptTOS ? Date.now() : firebaseUtils.getFireStorDel();

      user.tosTS = typeof tosVal === "number" ? tosVal : null;
      await userDocRef.update("tosTS", tosVal);
      res.send(user);
    } catch (error) {
      functions.logger.error(firUser.uid, `[uid: ${firUser.uid}] ${error}`);
      res.status(500).send(error);
    }
  },

  generateTestLoginToken: async (req: functions.Request, res: functions.Response) => {
    if (!firebaseUtils.setCommonHeaders(req, res)) {
      return;
    }

    const testPassword = req.body.password as string;
    if (!testPassword || testPassword != "yctest24") {
      res.status(403).send({"error": "Incorrect Password"});
    }

    const uid = "5g5bdA76ghPGeUFnoBJ62JVwQzt1";

    try {
      const loginToken = await firebaseUtils.auth.createCustomToken(uid);
      res.status(200).send({loginToken});
    } catch (error) {
      console.error("Error generating custom token:", error);
      res.status(500).send({error: "Internal server error"});
    }
  },

};
