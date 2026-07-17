import { Request, Response } from "express";
import { fetchUsersData } from "../service/fetchUsers.service.js";

export const usersData = async (_req: Request, res: Response) => {
  const result = await fetchUsersData();

  return res.status(result.success ? 200 : 500).json(result);
};