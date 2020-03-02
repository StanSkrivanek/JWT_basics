const express = require("express");
// Install Body-parser to let express be able to read request in JSON format
const bodyParser = require("body-parser");
// initiate `jsonwebtoken`
const jwt = require("jsonwebtoken");

const app = express();
// set new variable "PORT" with `process.env.PORT`. If env. variable (PORT) is not found use port 8888
const PORT = process.env.PORT || 8888;

// create FAKE database
const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];

// use middleware`body-parser` to be able handle JSON responses. THis mean that now we are able to read request `body`
app.use(bodyParser.json());

// route (endpoint)
// app.use(route, callback)
app.post("/login", (req, res) => {
  // request to check user authentication contain username and password
  if (!req.body.username || !req.body.password) {
    // build response
    res.status(400).send("You need a username and password");
    // if one of these conditions is not TRUE stop execution
    return;
  }

  // store values username and password if matches request
  const user = users.find(usr => {
    return (
      usr.username === req.body.username && usr.password === req.body.password
    );
  });

  // if no user
  if (!user) {
    // send response message
    res.status(401).send("User Not Found");
    // then stop execution
    return;
  }

  const token = jwt.sign(
    {
      // passing payload
      sub: user.id,
      username: user.username
    },
    "mysupersecretkey", //secret key in string
    { expiresIn: "3 hours" } // option
  );
  res.status(200).send({ access_token: token });
});

// Add "catch ALL" route. This mean any route that wasn't defined return `404` error
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// and then initialize server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
