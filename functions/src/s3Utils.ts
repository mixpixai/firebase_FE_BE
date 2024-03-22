/* eslint-disable max-len */
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";


const s3Client = new S3Client({
  region: "wnam", // Cloudflare R2 doesn't require a specific region, but the AWS SDK does require this field
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
  },
  endpoint: process.env.CLOUDFLARE_ENDPOINT, // Specify your R2 bucket endpoint
  forcePathStyle: true, // Use path-style endpoint rather than virtual-hosted-style
});

export const BucketType = {
  public: process.env.CLOUDFLARE_PUBLIC_BUCKET_NAME as string,
};

const extractContentTypeAndDecodeBase64 = (imageBase64: string): { contentType: string, buffer: Buffer } => {
  const match = imageBase64.match(/^data:(image\/\w+);base64,/);

  if (!match) {
    throw new Error("Invalid base64 image data");
  }

  const contentType = match[1]; // Extracted content type
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, ""); // Remove the data URI prefix
  const buffer = Buffer.from(base64Data, "base64"); // Convert base64 string to Buffer

  return {contentType, buffer};
};

export const uploadFile = async (bucketType:string, destinationFilePath: string, imageBase64: string) => {
  const {contentType, buffer} = extractContentTypeAndDecodeBase64(imageBase64);

  const command = new PutObjectCommand({
    Bucket: bucketType, // Specify your bucket name here
    Key: destinationFilePath,
    Body: buffer,
    ContentType: contentType,
  });

  const response = await s3Client.send(command);
  console.log("Successfully uploaded. Response:", response);
  return response;
};


export const deleteFile = async (bucketType:string, objectPath: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketType,
    Key: objectPath,
  });

  const response = await s3Client.send(command);
  console.log("Successfully deleted:", response);
  return response;
};
