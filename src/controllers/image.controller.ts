import { Request, Response } from "express";
import imageService from "../services/image.service";

export const uploadCsvAndStartProcessing = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await imageService.uploadCsvAndStartProcessing();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
