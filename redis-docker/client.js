import { default as Redis } from "ioredis";
import { config } from 'dotenv';

config();

const redis = new Redis({
    port: process.env.PORT,
    password: process.env.PASSWORD
});

export default redis;