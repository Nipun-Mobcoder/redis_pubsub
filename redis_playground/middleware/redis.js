import redis from '../client.js';

export const rateLimiter = ({ limit = 5, timer = 60, key }) => async (req, res, next) => {
    const clientIp =   req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const fullKey = `${clientIp}:${key}:request_count`;
    const requestCount = await redis.incr(fullKey);
    console.log(fullKey,requestCount);

    if(requestCount === 1){
        await redis.expire(fullKey, timer);
    }
    const timeLimit = await redis.ttl(fullKey);
    if(requestCount > limit){
        return res.json(`Callled too many times please try after ${timeLimit}`)
    }
    next()
} 