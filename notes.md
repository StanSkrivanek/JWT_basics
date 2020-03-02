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
