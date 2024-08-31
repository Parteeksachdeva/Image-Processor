import { Request, Response } from "express";
import imageService from "../services/image.service";

export const uploadCsvAndStartProcessing = async (
  req: Request,
  res: Response
) => {
  try {
    const sheetData = req.sheetData;
    const result = await imageService.uploadCsvAndStartProcessing(sheetData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
