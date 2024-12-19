import express from 'express';
import redis from './client.js';
import { rateLimiter } from '../redis_playground/middleware/redis.js';

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        // await redis.set("test", "Hello World")
        const data = await redis.get("test");
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
})

app.get('/string', rateLimiter({limit: 5,timer: 60, key: "string"}), async (req,res) => {
    // let photos = await redis.get("photos")
    // if(photos) {
    //     console.log("data");
    //     return res.json(JSON.parse(photos))
    // }
    // console.log("noData")
    // const {data} = await axios.get('https://jsonplaceholder.typicode.com/photos')
    // await redis.setex("photos", 60, JSON.stringify(data))
    // await redis.expire("photos",20);
    await redis.set("myKey", "Hello");
    await redis.append("myKey", " World");
    const data = await redis.get("myKey");
    return res.send(data)
})

app.get('/lists', rateLimiter({limit: 5,timer: 60, key: "lists"}) , async (req,res) => {
    // await redis.lpush('arr', 'Nipun')
    // await redis.lpush('arr', 'Harsh')
    // await redis.rpush('arr', 'Karan')
    // await redis.lpop('arr')
    // await redis.rpush('arr', 'Harsh')
    const arr = await redis.lrange("arr",0,-1)
    const val = await redis.lindex("arr",1);
    console.log(val)
    return res.json(arr)
})

app.get('/hash', rateLimiter({limit: 5,timer: 60, key: "hash"}) , async (req,res) => {
    // await redis.hset("marks", {
    //     "history": 67,
    //     "math": 89,
    //     "science": 81,
    //     "english": 77
    // })
    await redis.expire("marks", 20)
    const type = await redis.type("marks");
    const incrMath = await redis.hincrby("marks", "math", 4);
    let marks = await redis.hvals("marks");
    console.log(incrMath, type, marks)
    const historyMarks = await redis.hget("marks", "history")
    // await redis.hdel("marks", "englis")
    marks = await redis.hgetall("marks");
    return res.json(marks)
})

app.listen(4000, () => {
    console.log("Server running at http://localhost:4000")
})

