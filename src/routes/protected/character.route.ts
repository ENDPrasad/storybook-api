import { Router } from 'express';
import { uploadCharacterImageMiddleware, createCharacterHandler, getCharacterHandler } from '../../controller/character.controller.js';

const router = Router();

// POST /api/protected/character
// Accepts multipart/form-data: character fields + image file (field name: "image")
router.post('/', uploadCharacterImageMiddleware, createCharacterHandler);

// GET /api/protected/character/:id
// Returns character details and all linked character_images
router.get('/:id', getCharacterHandler);

export default router;
