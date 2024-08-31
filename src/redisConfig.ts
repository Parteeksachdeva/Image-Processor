import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on("error", function (err) {
  throw err;
});

redisClient.on("connect", function () {
  console.log("Connected to Redis");
});

export default redisClient;
