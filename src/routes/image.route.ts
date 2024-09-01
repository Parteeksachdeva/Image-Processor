import express from "express";
import multer from "multer";

import {
  getCompressedData,
  getRequestStatus,
  uploadCsvAndStartProcessing,
} from "../controllers/image.controller";
import { validateExcelAndConvertTOJSON } from "../middlewares/validation";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  `/upload-csv`,
  upload.single("file"),
  validateExcelAndConvertTOJSON,
  uploadCsvAndStartProcessing
);

router.get(`/request-status`, getRequestStatus);

router.get(`/get-compressed-data`, getCompressedData);

export { router as ImageRoute };
