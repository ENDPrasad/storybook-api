import { Router } from 'express';
import { uploadCharacterImageMiddleware, createCharacterHandler } from '../../controller/character.controller.js';

const router = Router();

// POST /api/protected/character
// Accepts multipart/form-data: character fields + image file (field name: "image")
router.post('/', uploadCharacterImageMiddleware, createCharacterHandler);

export default router;
