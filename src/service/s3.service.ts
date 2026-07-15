import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { headBucket } from "../integrations/aws/s3.service.js";

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