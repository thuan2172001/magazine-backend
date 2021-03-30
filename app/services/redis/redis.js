const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error("Redis error: " + error.message);
});
client.on('connect', function () {
  console.log('Redis connection established');
});

module.exports = {
  redisClient: client
}
