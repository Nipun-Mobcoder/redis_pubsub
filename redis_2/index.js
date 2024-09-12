const client = require('./client');
const express = require('express');

const app = express();

app.use(express.json());

app.post('/', (req,res) => {
    client.publish("user-data", JSON.stringify({ ...req.body }))
    res.json(req.body)
})

app.listen(3000, ()=> {
    console.log("Server running at 3000")
})