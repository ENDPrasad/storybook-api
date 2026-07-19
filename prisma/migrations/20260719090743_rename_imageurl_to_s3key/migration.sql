-- Step 1: Add s3Key as nullable so existing rows are not blocked
ALTER TABLE "character_images" ADD COLUMN "s3Key" TEXT;

-- Step 2: Populate s3Key by extracting the object key from the stored URL
-- Strips everything up to and including "amazonaws.com/"
UPDATE "character_images"
SET "s3Key" = SUBSTRING("imageUrl" FROM POSITION('amazonaws.com/' IN "imageUrl") + LENGTH('amazonaws.com/'))
WHERE "imageUrl" IS NOT NULL;

-- Step 3: Enforce NOT NULL now that all rows have a value
ALTER TABLE "character_images" ALTER COLUMN "s3Key" SET NOT NULL;

-- Step 4: Drop the old imageUrl column
ALTER TABLE "character_images" DROP COLUMN "imageUrl";
