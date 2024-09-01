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

export const getRequestStatus = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const request_id = +query["request_id"];

    if (!request_id || isNaN(request_id)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid request_id" });
    }

    const result = await imageService.getRequestStatus(request_id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCompressedData = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const request_id = +query["request_id"];

    if (!request_id || isNaN(request_id)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid request_id" });
    }

    const result = await imageService.getCompressedData(request_id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
