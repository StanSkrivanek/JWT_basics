const express = require("express");

const app = express();
const PORT = 8888;
// route (endpoint)
// app.use(endpoint, callback)

app.get("/status", (req, res) => {
  const localTime = new Date().toLocaleTimeString();

  // build response
  res.status(200).send(`Server time is ${localTime}`);
});

// Add "catch ALL" route. This mean any route that wasn't defined return `404` error
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// and then initialize server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// then run server in terminal command `node .`
// in browser type `localhost:8888` => return server not found
// add route `localhost:8888/status` => return local time
// any other `undefined` route give us 404 error
