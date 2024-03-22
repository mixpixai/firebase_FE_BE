/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {BucketType, deleteFile, uploadFile} from "../s3Utils";

const publicURL = "https://pub-a9cd5deb9a674cf781fe4e56075c4c4d.r2.dev";

const getFacePath = (uid:string) => `models/${uid}_face.jpg`;

export const storageService = {
  uploadFaceImage: async (uid:string, facePhotoBase64: string) => {
    const facePath = getFacePath(uid);
    const response = await uploadFile(BucketType.public, facePath, facePhotoBase64);
    console.log(response);
    return (`${publicURL}/${facePath}`);
  },

  deleteFaceImage: async (uid:string) => {
    const response = await deleteFile(BucketType.public, getFacePath(uid));
    return response;
  },
};
