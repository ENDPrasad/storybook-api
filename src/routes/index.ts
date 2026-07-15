import { Router } from "express";
import publicRoutes from "./public/index.js";
import protectedRoutes from "./protected/index.js";

const router = Router();

router.use("/public", publicRoutes);
router.use("/protected", protectedRoutes);

export default router;