import xlsx from "xlsx";
import axios from "axios";

interface ExcelRow {
  "S. No.": number;
  "Product Name": string;
  "Input Image Urls": string;
}

//Todo: Give exact row number to user which is causing validation error
export const validateExcelAndConvertTOJSON = async (req, res, next) => {
  const buffer = req.file.buffer;

  if (!buffer) {
    return res.status(400).json({ error: "Please provide a valid Excel file" });
  }

  try {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData: ExcelRow[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );
    const newSheetData = [];

    for (const row of sheetData) {
      const {
        "S. No.": serialNumber,
        "Product Name": productName,
        "Input Image Urls": inputImageUrls,
      } = row;

      if (!serialNumber || !productName || !inputImageUrls) {
        return res.status(400).json({
          error:
            "Missing required fields: S. No., Product Name, or Input Image Urls",
        });
      }

      const urls = inputImageUrls.split(",").map((url) => url.trim());

      for (const url of urls) {
        if (!isValidUrl(url)) {
          return res.status(400).json({ error: `Invalid URL: ${url}` });
        }

        try {
          const response = await axios.head(url);
          const contentType = response.headers["content-type"];

          if (!contentType.startsWith("image/")) {
            return res
              .status(400)
              .json({ error: `URL does not point to a valid image: ${url}` });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ error: `Unable to access URL: ${url}` });
        }
      }

      newSheetData.push({ serialNumber, productName, inputImageUrls });
    }

    req.sheetData = newSheetData;
    delete req.file;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Error processing the Excel file" });
  }
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
