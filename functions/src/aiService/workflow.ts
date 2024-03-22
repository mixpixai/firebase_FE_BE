/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
import {firebaseUtils} from "../firebaseUtils";
import {WorkflowType, ComfyUIRequest} from "./ai.types";

export const getWorkflowPayload = async (req: ComfyUIRequest, uid:string) => {
  const workFlowID = req.workflow;
  const store = firebaseUtils.store;
  const promptDoc = store.doc(`prompts/${workFlowID}`);
  const promptDS = await promptDoc.get();
  const promptObj = promptDS.data() as {val: string};
  let prompt = promptObj.val as string;
  prompt = prompt.replaceAll("__SEED__", req.seed?.toString() ?? "");
  prompt = prompt.replaceAll("__FACEIMAGE__", req.faceImage ?? "");
  prompt = prompt.replaceAll("__MODELID__", req.modelId ?? "");
  prompt = prompt.replaceAll("__BODYIMAGE__", req.bodyImage ?? "");
  prompt = prompt.replaceAll("__DRESSIMAGE__", req.dressImage ?? "");
  prompt = prompt.replaceAll("__UID__", uid);
  prompt = prompt.replaceAll("__LEFTPADDING__", req.leftPadding?.toString() ?? "");

  if (workFlowID === WorkflowType.singleUserPrompt) {
    const faceName = req.modelId ? `${req.modelId}_face.jpg` : "face.jpg";
    prompt = prompt.replaceAll("__FACE_NAME__", faceName);
  }
  prompt = prompt.replaceAll("__PROMPT__", req.prompt ?? "");

  const retObj = JSON.parse(prompt);
  if (workFlowID === WorkflowType.singleUserPrompt) {
    if (req.faceImage) {
      retObj.input.images = [
        {
          "name": "face.jpg",
          "image": req.faceImage,
        }];
    }
  }

  return retObj;
};
