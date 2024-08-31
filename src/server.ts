import app from "./app";
import redisClient from "./redisConfig";

const PORT = process.env.PORT || 3000;

redisClient.connect().then(() => {
  console.log("Redis connected");
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
