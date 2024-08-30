import express from "express";

import { uploadCsvAndStartProcessing } from "../controllers/image.controller";

const router = express.Router();

router.post(`/upload-csv`, uploadCsvAndStartProcessing);

export { router as ImageRoute };
