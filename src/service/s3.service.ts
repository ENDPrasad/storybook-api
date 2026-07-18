import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { headBucket,putObject,getImageObject } from "../integrations/aws/s3.service.js";
import { randomUUID } from "crypto";

const unqFamilyId = '123-456-789'; // will generate a unique family id for each family, this is just a placeholder for now

type UploadImageInput = {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
};

const mimeToExt: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const checkS3Status = async () => {
  try {
    await headBucket();

    return {
      success: true,
      message: "S3 connection successful",
      data: {
        bucket: env.aws.s3Bucket,
        region: env.aws.region,
      },
      meta: null,
    };
  } catch (error) {
    logger.error({ error }, "Failed to check S3 connection");

    return {
      success: false,
      message: "S3 connection failed",
      data: null,
      meta: null,
    };
  }
};

export const uploadImageToS3 = async ({originalName, mimeType, buffer}: UploadImageInput) => {
  try {
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "jpg";
    const safeExt = mimeToExt[mimeType] || "jpg";
    const key = `${env.aws.s3Prefix ? `${env.aws.s3Prefix}/` : ""}${unqFamilyId}/${randomUUID()}.${safeExt}`;
    
    await putObject({
      key,
      body: buffer,
      contentType: mimeType,
    })

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        key,
        url: `https://${env.aws.s3Bucket}.s3.${env.aws.region}.amazonaws.com/${key}`,
      },
      meta: null,
    }

  } catch(error){
    logger.error({ error }, "Failed to upload image to S3");
    console.error("Failed to upload image to S3", error);
  }

  return {
    success: false,
    message: "Image upload failed",
    data: null,
    meta: null,
  }

}

export const getImageFromS3 = async (key: string) => {
  try {
    const response = await getImageObject(env.aws.s3Bucket, key);
    return {
      success: true,
      message: "Image retrieved successfully",
      data: {
        key,
        contentType: response.ContentType,
        body: response.Body, // This is a stream
      },
      meta: null,
    };
  } catch (error) {
    logger.error({ error }, "Failed to retrieve image from S3");
    console.error("Failed to retrieve image from S3", error);
  }

  return {
    success: false,
    message: "Image retrieval failed",
    data: null,
    meta: null,
  };
};