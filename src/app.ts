import express from "express";
import { json } from "body-parser";
require("dotenv").config();

import { ImageRoute } from "./routes/image.route";
import CompressionService from "./services/compression.service";
import CronService from "./services/cron.service";

const app = express();
app.use(json());

app.use(`/api/images`, ImageRoute);

app.get("/ping", (req, res) => {
  res.json({ ping: "pong" });
});

//Run At a interval
new CompressionService();
new CronService().changeRequestStatus();

export default app;
