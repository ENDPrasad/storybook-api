import { Router } from "express";
import s3Routes from "./s3.routes.js";
import users from "./fetchUsers.route.js";
import characterRoutes from "./character.route.js";

const router = Router();

router.use("/s3", s3Routes);
router.use("/fetch", users);
router.use("/character", characterRoutes);

export default router;