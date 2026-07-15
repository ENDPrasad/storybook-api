import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
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