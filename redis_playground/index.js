import axios from 'axios';
import redis from './client.js';
import express, { json } from 'express';
import { rateLimiter } from './middleware/redis.js';

const app = express();

app.use(json());

app.get('/string', rateLimiter({limit: 5,timer: 60, key: "keys"}), async (req,res) => {
    let photos = await redis.get("photos")
    if(photos) {
        console.log("data");
        return res.json(JSON.parse(photos))
    }
    console.log("noData")
    const {data} = await axios.get('https://jsonplaceholder.typicode.com/photos')
    await redis.setex("photos", 20, JSON.stringify(data))
    // await redis.expire("photos",20);
    return res.json(data)
})

app.get('/lists', rateLimiter({limit: 5,timer: 60, key: "lists"}) , async (req,res) => {
    // await redis.lpush('arr', 'Nipun')
    // await redis.lpush('arr', 'Harsh')
    // await redis.rpush('arr', 'Karan')
    // await redis.lpop('arr')
    // await redis.rpush('arr', 'Harsh')
    const arr = await redis.lrange("arr",0,-1)
    console.log(arr)
    return res.json("Sent successfully")
})

app.get('/hash', rateLimiter({limit: 5,timer: 60, key: "hash"}) , async (req,res) => {
    await redis.hset("marks", {
        "history": 67,
        "math": 89,
        "science": 81,
        "englis": 77
    })
    await redis.expire("marks", 20)
    const incrMath = await redis.hincrby("marks", "math", 4);
    console.log(incrMath)
    // const historyMarks = await redis.hget("marks", "history")
    const marks = await redis.hgetall("marks");
    return res.json(marks)
})

app.get('/set', rateLimiter({limit: 5,timer: 60, key: "set"}), async (req, res) => {
    const res1 = await redis.sadd("history", ["Nipun", "Karan", "Harsh"] )
    const res2 = await redis.sadd("math", ["Nipun", "Harsh"] )
    const res3 = await redis.sadd("math", "Nipun" )
    const res4 = await redis.sadd( "physics", "Karan" )
    
    const sMember = await redis.smembers("math")
    console.log(res3, res4, sMember);
    const interStudents = await redis.sinter('history','math')
    const unionStudents = await redis.sunion('history','physics')
    res.json({interStudents,unionStudents});
})

app.listen(5000, ()=> {
    console.log("Server running at 5000")
})