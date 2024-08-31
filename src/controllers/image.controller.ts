import { Request, Response } from "express";
import imageService from "../services/image.service";

export const uploadCsvAndStartProcessing = async (
  req: Request,
  res: Response
) => {
  try {
    const sheetData = req.sheetData;
    const { webhook_url = null } = req.body;
    const result = await imageService.uploadCsvAndStartProcessing(
      sheetData,
      webhook_url
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
