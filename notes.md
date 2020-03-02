# Notes

# 01 - Set basic Express Server

First initialize npm `npm init -y` and then install Express `npm i express`

Then write this code

```javascript
const express = require("express");

const app = express();
// Set PORT
const PORT = 8888;

// Set your first route (endpoint)
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
```

Next: run server in terminal command `node .` or `node index.js`
And then in browser type `localhost:8888`, this will return `server not found`

When we add defined route `/status` => `localhost:8888/status` it will return `localTime`. Any other `undefined` route give us `404` error

## 02 - Environment Variable

We will set a new env variable "PORT" with `process.env.PORT`. If env. variable (PORT) is not found use port 8888

```javascript
const PORT = process.env.PORT || 8888;
```

Lets try it if it works

Stop server an the write in terminal

```bash
export PORT=3000
```

Then start server an you should see message that our port is running on port 3000

When we add in browser `localhost:3000/status` we should get our local time

## POST requests

to be able handle POST request we will use Express `post` method
and create route that handle users logins

We need to install a middleware `body-parser`

```bash
npm i body-parser
```

Than initiate it

```javascript
// initiate body-parser to let express be able read requests in JSON format
const bodyParser = require("body-parser");
```

Define `login` route

```javascript
app.post("/login", (req, res) => {
  // user variable will hold value of `username` property that was be passed in request of our JSON object (body)
  const user = req.body.username;

  // build response (what will be returned on success)
  res.status(200).send(`You logged in with ${user}`);
});
```

Restart your server and for test if all is running so far we will use app [Postman](https://www.postman.com/)

### Postman

in app try to do GET request to `http://localhost:3000/` and we will get error `Not Found`, thats fine as we do not have any user yet but we can see that connection between Postman and server 3000 works.

now lets tru to do SEND request to send some data as JSON Object

Go to `Body` tab choose `raw` and in last option (right) choose `JSON` as format. Then create JSON object with `username` property

```json
{
  "username": "Admin"
}
```

Once you `Send` this request you should see response `You logged in with Admin`
