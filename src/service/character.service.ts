import { prisma } from '../integrations/lib/prisma.js';
import { logger } from '../config/logger.js';
import { uploadImageToS3 } from './s3.service.js';

type CreateCharacterInput = {
  orderId: string;
  name: string;
  gender: string;
  age: number;
  hobbies: string;
  storyRole: string;
  customMessage: string;
  image: {
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  };
};

export const createCharacter = async (input: CreateCharacterInput) => {
  try {
    // 1. Upload image to S3 first — the URL becomes image_url in character_images
    const uploadResult = await uploadImageToS3({
      originalName: input.image.originalName,
      mimeType: input.image.mimeType,
      buffer: input.image.buffer,
    });

    if (!uploadResult.success || !uploadResult.data) {
      return {
        success: false,
        message: 'Image upload to S3 failed',
        data: null,
        meta: null,
      };
    }

    const imageUrl = uploadResult.data.url;

    // 2. Create character + character_image atomically
    const result = await prisma.$transaction(async (tx) => {
      const character = await tx.character.create({
        data: {
          orderId: input.orderId,
          name: input.name,
          gender: input.gender,
          age: input.age,
          hobbies: input.hobbies,
          storyRole: input.storyRole,
          customMessage: input.customMessage,
        },
      });

      const characterImage = await tx.characterImage.create({
        data: {
          characterId: character.id,
          imageUrl,
        },
      });

      return { character, characterImage };
    });

    return {
      success: true,
      message: 'Character created successfully',
      data: {
        character: result.character,
        image: {
          id: result.characterImage.id,
          imageUrl: result.characterImage.imageUrl,
          s3Key: uploadResult.data.key,
        },
      },
      meta: null,
    };
  } catch (error) {
    logger.error({ error }, 'Failed to create character');

    return {
      success: false,
      message: 'Failed to create character',
      data: null,
      meta: null,
    };
  }
};
