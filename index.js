const express = require("express");

const app = express();
// set new variable "PORT" with `process.env.PORT`. If env. variable (PORT) is not found use port 8888
const PORT = process.env.PORT || 8888;

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
