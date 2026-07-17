import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const envPath = fs.existsSync(path.resolve(process.cwd(), ".env"))
  ? path.resolve(process.cwd(), ".env")
  : path.resolve(process.cwd(), ".env.example");

dotenv.config({ path: envPath });

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  aws: {
    region: process.env.AWS_REGION || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    s3Bucket: process.env.AWS_S3_BUCKET || "",
    s3Prefix: process.env.AWS_S3_PREFIX || "",
  },
  postgres: {
    databaseURL: process.env.DATABASE_URL || "",
    directURL: process.env.DIRECT_URL || ""
  }
};
