import express from "express";
import multer from "multer";

import {
  getRequestStatus,
  uploadCsvAndStartProcessing,
} from "../controllers/image.controller";
import { validateExcelAndConvertTOJSON } from "../middlewares/validation";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(`/request-status`, getRequestStatus);

router.post(
  `/upload-csv`,
  upload.single("file"),
  validateExcelAndConvertTOJSON,
  uploadCsvAndStartProcessing
);

export { router as ImageRoute };
