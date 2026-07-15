import { Router } from "express";
import { getS3Status } from "../../controller/s3.controller.js";

const router = Router();

router.get("/status", getS3Status);

export default router;