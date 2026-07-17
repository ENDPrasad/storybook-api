import { Router } from "express";
import s3Routes from "./s3.routes.js";
import  users from "./fetchUsers.route.js";

const router = Router();

router.use("/s3", s3Routes);
router.use("/fetch", users);

export default router;