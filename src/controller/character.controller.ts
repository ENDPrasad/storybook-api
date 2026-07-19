import multer from 'multer';
import { Request, Response } from 'express';
import { createCharacter, getCharacter } from '../service/character.service.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export const uploadCharacterImageMiddleware = upload.single('image');

export const createCharacterHandler = async (req: Request, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided. Use field name: image',
      data: null,
      meta: null,
    });
  }

  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({
      success: false,
      message: 'Only image uploads are allowed',
      data: null,
      meta: null,
    });
  }

  const { orderId, name, gender, age, hobbies, storyRole, customMessage } = req.body as Record<string, string>;

  const missing = ['orderId', 'name', 'gender', 'age', 'hobbies', 'storyRole', 'customMessage'].filter(
    (f) => !req.body[f]
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

  const result = await createCharacter({
    orderId,
    name,
    gender,
    age: parsedAge,
    hobbies,
    storyRole,
    customMessage,
    image: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
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
