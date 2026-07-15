import { Request, Response } from "express";
import { checkS3Status } from "../service/s3.service.js";

export const getS3Status = async (_req: Request, res: Response) => {
  const result = await checkS3Status();

  return res.status(result.success ? 200 : 500).json(result);
};