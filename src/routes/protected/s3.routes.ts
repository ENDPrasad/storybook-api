import { Router } from "express";
import { getS3Status, uploadImageToS3, uploadImageMiddleware, getImageFromS3 } from "../../controller/s3.controller.js";

const router = Router();

router.get("/status", getS3Status);
router.get("/image/*splat", getImageFromS3);
router.post('/upload', uploadImageMiddleware, uploadImageToS3);

export default router;