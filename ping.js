const https = require("https");

const url = https://alex-gm0i.onrender.com/"; // replace with your bot's URL

function ping() {
  https.get(url, (res) => {
    console.log(`Pinged ${url} - Status Code: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`Error pinging ${url}:`, err.message);
  });
}

// Ping every 5 minutes (300,000 ms)
setInterval(ping, 5 * 60 * 1000);

// Initial ping immediately
ping();
