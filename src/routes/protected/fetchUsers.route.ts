import { Router } from 'express';
import { usersData } from '../../controller/fetchUsers.controller.js';

const router = Router();

router.get("/users", usersData);

export default router;