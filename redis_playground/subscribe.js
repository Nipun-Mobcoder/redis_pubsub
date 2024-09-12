const client = require('./client');

async function init() {
    client.subscribe("user-data", (err, count) => {
        if (err) console.error(err.message);
        console.log(`Subscribed to ${count} channels.`);
      });

    client.on("message", (channel, message) => {
    console.log(`Received message from ${channel} channel.`);
    console.log(JSON.parse(message));
    });
}

init();