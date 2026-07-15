import { Router } from "express";
import s3Routes from "./s3.routes.js";

const router = Router();

router.use("/s3", s3Routes);

export default router;