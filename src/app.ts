import express from "express";
import { json } from "body-parser";
require("dotenv").config();

import { ImageRoute } from "./routes/image.route";

const app = express();
app.use(json());

app.use(`/api/images`, ImageRoute);

app.get("/ping", (req, res) => {
  res.json({ ping: "pong" });
});

export default app;
