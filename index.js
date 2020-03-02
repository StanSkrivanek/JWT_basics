const express = require("express");
// Install Body-parser to let express be able to read request in JSON format
const bodyParser = require("body-parser");

const app = express();
// set new variable "PORT" with `process.env.PORT`. If env. variable (PORT) is not found use port 8888
const PORT = process.env.PORT || 8888;

// use middleware`body-parser` to be able handle JSON responses. THis mean that now we are able to read request `body`
app.use(bodyParser.json());

// route (endpoint)
// app.use(route, callback)
app.post("/login", (req, res) => {
  // user variable will hold value of `username` property that was be passed in request of our JSON object (body)
  const user = req.body.username;

  // build response (what will be returned on success)
  res.status(200).send(`You logged in with ${user}`);
});

// Add "catch ALL" route. This mean any route that wasn't defined return `404` error
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// and then initialize server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
