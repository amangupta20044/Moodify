const Redis = require("ioredis").default

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
})

redis.on("connect",()=>{
    console.log("server is Connected to Redis")
})
redis.on("error",(err)=>{
    console.log("Redis connection error:", err)
})
module.exports = redis