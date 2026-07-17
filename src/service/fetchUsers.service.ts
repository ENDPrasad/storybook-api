import { prisma } from '../integrations/lib/prisma.js';
import { logger } from "../config/logger.js";

export const fetchUsersData = async () => {
    try {
        const result = await prisma.user.findMany();

        return {
            success: true,
            data: result,
            message: "Data Fetched Successfually",
            meta: null
        }
    }
    catch (error) {
        logger.error({ error }, "Failed to fetch the data");

        return {
            success: false,
            message: "Failed to fetch data",
            data: null,
            meta: null,
        };
    }
}