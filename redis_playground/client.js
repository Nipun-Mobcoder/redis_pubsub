import { Redis } from 'ioredis';
import { config } from 'dotenv';

config();

const redis = new Redis({
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT
});

export default redis;