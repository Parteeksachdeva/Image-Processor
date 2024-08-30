const express = require("express");

const app = express();

app.get("/ping", (req, res) => {
  res.json({ ping: "pong" });
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
  }

  console.log("Server listening on port", 3000);
});
