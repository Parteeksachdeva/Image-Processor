import app from "./app";
import { prisma } from "./data-source";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
