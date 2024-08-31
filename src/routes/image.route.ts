import express from "express";
import multer from "multer";

import { uploadCsvAndStartProcessing } from "../controllers/image.controller";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: "upload/" });

router.post(`/upload-csv`, upload.single("file"), uploadCsvAndStartProcessing);

export { router as ImageRoute };
