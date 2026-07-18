import multer from "multer";
import { Request, Response } from "express";
import { checkS3Status, uploadImageToS3 as uploadImageToS3Service, getImageFromS3 as getImageFromS3Service } from "../service/s3.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
})

export const uploadImageMiddleware = upload.single("image");

export const getS3Status = async (_req: Request, res: Response) => {
  const result = await checkS3Status();

  return res.status(result.success ? 200 : 500).json(result);
};

export const uploadImageToS3 = async (req: Request, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file provided. Use field name: image",
      data: null,
      meta: null,
    });
  }
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      success: false,
      message: "Only image uploads are allowed",
      data: null,
      meta: null,
    });
  }

  const result = await uploadImageToS3Service({
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    buffer: req.file.buffer,
  })

  return res.status(result.success ? 201 : 500).json(result);

}

export const getImageFromS3 = async (req: Request, res: Response): Promise<Response> => {
  const params = req.params as Record<string, unknown>;
  const rawKey = params.splat ?? params[0] ?? params.key;
  const key = Array.isArray(rawKey)
    ? rawKey.join("/")
    : typeof rawKey === "string"
      ? rawKey
      : "";

  if (!key) {
    return res.status(400).json({
      success: false,
      message: "No image key provided",
      data: null,
      meta: null,
    });
  }

  const result = await getImageFromS3Service(key);

  if (!result.success) {
    return res.status(500).json(result);
  }

  const contentType = result.data?.contentType || "application/octet-stream";
  const body = result.data?.body as any;

  if (body && typeof body.transformToByteArray === "function") {
    const bytes = await body.transformToByteArray();
    return res.status(200).setHeader("Content-Type", contentType).send(Buffer.from(bytes));
  }

  if (body && typeof body.pipe === "function") {
    res.setHeader("Content-Type", contentType);
    body.pipe(res);
    return res;
  }

  return res.status(200).setHeader("Content-Type", contentType).send(body ?? "");
}