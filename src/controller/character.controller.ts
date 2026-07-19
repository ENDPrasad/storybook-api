import { Request, Response } from 'express';
import { createCharacter, getCharacter } from '../service/character.service.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const createCharacterHandler = async (req: Request, res: Response): Promise<Response> => {
  const { orderId, name, gender, age, hobbies, storyRole, customMessage, image } = req.body ?? {};

  // Validate text fields
  const missing = ['orderId', 'name', 'gender', 'age', 'hobbies', 'storyRole', 'customMessage', 'image'].filter(
    (f) => !req.body?.[f]
  );

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(', ')}`,
      data: null,
      meta: null,
    });
  }

  const parsedAge = Number(age);
  if (isNaN(parsedAge)) {
    return res.status(400).json({
      success: false,
      message: 'age must be a valid number',
      data: null,
      meta: null,
    });
  }

  // Validate image object
  if (!image.data || !image.mimeType || !image.originalName) {
    return res.status(400).json({
      success: false,
      message: 'image must include data (base64), mimeType, and originalName',
      data: null,
      meta: null,
    });
  }

  if (!ALLOWED_MIME_TYPES.includes(image.mimeType)) {
    return res.status(400).json({
      success: false,
      message: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      data: null,
      meta: null,
    });
  }

  // Decode base64 → Buffer
  const buffer = Buffer.from(image.data, 'base64');

  if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
    return res.status(400).json({
      success: false,
      message: 'Image exceeds the 20MB size limit',
      data: null,
      meta: null,
    });
  }

  const result = await createCharacter({
    orderId,
    name,
    gender,
    age: parsedAge,
    hobbies,
    storyRole,
    customMessage,
    image: {
      originalName: image.originalName,
      mimeType: image.mimeType,
      buffer,
    },
  });

  return res.status(result.success ? 201 : 500).json(result);
};

export const getCharacterHandler = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Character id is required',
      data: null,
      meta: null,
    });
  }

  const result = await getCharacter(id);

  return res.status(result.success ? 200 : (result.message === 'Character not found' ? 404 : 500)).json(result);
};
