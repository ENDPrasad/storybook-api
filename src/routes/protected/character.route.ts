import { Router } from 'express';
import { createCharacterHandler, getCharacterHandler } from '../../controller/character.controller.js';

const router = Router();

// POST /api/protected/character
// Accepts JSON body: { orderId, name, gender, age, hobbies, storyRole, customMessage, image: { data, mimeType, originalName } }
// image.data must be a base64-encoded string of the image file
router.post('/', createCharacterHandler);

// GET /api/protected/character/:id
// Returns character details and all linked character_images
router.get('/:id', getCharacterHandler);

export default router;
