import { S3Client, HeadBucketCommand,PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../config/env.js";

const s3Client = new S3Client({
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

export const headBucket = async () => {
  const command = new HeadBucketCommand({
    Bucket: env.aws.s3Bucket,
  });

  return s3Client.send(command);
};

type UploadObjectInput = {
  key: string;
  body: Buffer;
  contentType: string;
};

export const putObject = async ({ key, body, contentType}: UploadObjectInput ) => {
  const command = new PutObjectCommand({
    Bucket: env.aws.s3Bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return s3Client.send(command);
}

export const getImageObject = async (bucket: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response;
};