import { prisma } from '../integrations/lib/prisma.js';
import { logger } from '../config/logger.js';
import { uploadImageToS3 } from './s3.service.js';
import { env } from '../config/env.js';

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

    const s3Key = uploadResult.data.key;

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
          s3Key,
        },
      });

      return { character, characterImage };
    });

    return {
      success: true,
      message: 'Character created successfully',
      data: {
        orderId: result.character.orderId,
        name: result.character.name,
        gender: result.character.gender,
        age: result.character.age,
        hobbies: result.character.hobbies,
        storyRole: result.character.storyRole,
        customMessage: result.character.customMessage,
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

export const getCharacter = async (id: string) => {
  try {
    const character = await prisma.character.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!character) {
      return {
        success: false,
        message: 'Character not found',
        data: null,
        meta: null,
      };
    }

    return {
      success: true,
      message: 'Character fetched successfully',
      data: {
        id: character.id,
        orderId: character.orderId,
        name: character.name,
        gender: character.gender,
        age: character.age,
        hobbies: character.hobbies,
        storyRole: character.storyRole,
        customMessage: character.customMessage,
        createdAt: character.createdAt,
        images: character.images.map((img) => ({
          id: img.id,
          imageUrl: `https://${env.aws.s3Bucket}.s3.${env.aws.region}.amazonaws.com/${img.s3Key}`,
          s3Key: img.s3Key,
          createdAt: img.createdAt,
        })),
      },
      meta: null,
    };
  } catch (error) {
    logger.error({ error }, 'Failed to fetch character');

    return {
      success: false,
      message: 'Failed to fetch character',
      data: null,
      meta: null,
    };
  }
};
