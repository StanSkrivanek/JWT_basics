# Notes

---

Requirement:
**3-rd party App:** `Postman`
**NPM:**
`express`, `body-parser`, `jsonwebtoken`, `express-jwt`

---

## 01 - Set basic Express Server

First initialize NPM `npm init -y` and then install Express `npm i express`

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

## 03 - POST requests

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

### In Postman

in app try to do GET request to `http://localhost:3000/` and we will get error `Not Found`, thats fine as we do not have any user yet but we can see that connection between Postman and server 3000 works.

now lets tru to do SEND request to send some data as JSON Object

Go to `Body` tab choose `raw` and in last option (right) choose `JSON` as format. Then create JSON object with `username` property

```json
{
  "username": "Admin"
}
```

Once you `Send` this request you should see response `You logged in with Admin`

## 04 - Using JWT

To create an Authentication server with JSON Web Token we have to install `jsonwebtoken`

```bash
npm i jsonwebtoken
```

Initiate it

```javascript
const jwt = require("jsonwebtoken");
```

lets create FAKE database (ATTENTION: Do not use this in production)

```javascript
// create FAKE database
const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];
```

Define request to check user authentication:

1.Check if username and password exist. If not send error message and stop execution

```javascript
// request to check user authentication contain username and password
if (!req.body.username || !req.body.password) {
  // buiLd response
  res.status(400).send("You need a username and password");
  // if one of these conditions is not TRUE stop execution
  return;
}
```

2.We have check if user is in our database. Create variable `user` that will hold values of `username` and `password` if username and password matches values in request

```javascript
const user = users.find(usr => {
  return (
    usr.username === req.body.username && usr.password === req.body.password
  );
});
```

3.Set response message if user is not found

```javascript
  // if no user
  if (!user) {
    // send response message
    res.status(401).send("User Not Found");
    // then stop execution
    return;
  }
});
```

If we have a valid user we will send JWT as response.
WE can use `sign` method to create a sign token.
We will pass the payload we want to attach to JWT, and than we pass a STRING which is a SECRET Key. Then we will add some other options as how long this token will stay valid.

Finally we create response that on success will return object with our access Token

### In Postman

We have out URL path set to `http://localhost:3000/login` and in `Body` tab that its format is set to `JSON` create user object

```json
{
  "username": "admin",
  "password": "admin"
}
```

Then apply `Send` and you should get as response Token

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1ODMxNDg4MjcsImV4cCI6MTU4MzE1OTYyN30.0RfV2eyN0CfTM_i_F9L_kDG6dIFq5AmQZCE9gSt8ojk"
}
```

To see its content copy token `eyJ...8ojk` (your will be different) and paste it in [JWT](https://jwt.io)

If you will apply wrong `username` or `password` you will get response `User Not Found`

## Authenticate user Access

Now we will set authentication for user to have access to protected data (no public data)

We will set SPI with 2 routes (URL endpoints). First route will have Access to PUBLIC recourses. Second route will have access to secret data and only accredited user with valid token will have permission to see these data.

first we will set our API_PORT

```javascript
const PORT = process.env.API_PORT || 8888;
```

and in terminal we will set tis port to 9000

```bash
export API_PORT=9000
```

Then we will set our routes

```javascript
// PUBLIC
app.get("/resource", (req, res) => {
  res.status(200).send("Public data, everyone can see these");
});

// SPECIFIC USER ONLY route (not protected yet)
app.get("/resource/secret", (req, res) => {
  res
    .status(200)
    .send(
      "Secret data, You have to have permission (be logged in ) to see these data"
    );
});
```

### in Postman

Set `GET` request to `http://localhost:9000` and `Send` it. Response will be `Not Found` because that route was not defined.

When we set our path to `http://localhost:9000/ recourse` response will be `Public data, everyone can see these`. Thats ok

When we set our path to `http://localhost:9000/ resource/secret` response will be `Secret data, You have to have permission (logged in ) to see these data`. This mean these secret data are NOT protected and everyone can see them.

`NOTE:` If it doesn't work for you try restart server 9000

## Block request to secret data

Our next step will be to block access to secret data by requesting valid JSON Token.

To do so we will use middleware `expressjwt`

Install `express-jwt`

```bash
npm i express-jwt
```

and add it as requirement

```javascript
const expressjwt = require("express-jwt");
```

Next we will initiate `expressjwt` and passing to it some options.In our case we will only check if the signature match the one from our Authentication server

```javascript
// Init express-jwt
const jwtCheck = expressjwt({
  secret: "mysupersecretkey"
});
```

Finally we will secure route to private data by adding middleware as second argument `app.get()` method

```javascript
app.get("/resource/secret", jwtCheck, (req, res) => {
  res
    .status(200)
    .send(
      "Secret data, You have to have permission (be logged in ) to see these data"
    );
});
```

Before running test in postman restart server

When we try to access data from `http://localhost:9000/resource/secret` wee get error `UnauthorizedError: No authorization token was found`. That fine because now are data protected front of unauthorized users.

To check functionality of accessing secret data with authorized user we have to have valid Token. If you loose your Token we will create a new one.

### In Postman

1. Set request to `POST` and path to `http://localhost:9000/login`
2. In `Body` tab set user Object

```json
{
  "username": "admin",
  "password": "admin"
}
```

and `Send` request. Response will be Token that we will copy token into clipboard

3. Open `Authorization` tab and from options choose `Bearer Token` and paste Token from clipboard into field on right

4. Change request to `GET`, route to `http://localhost:9000/resource/secret` and `Send` request.

Result should be `Secret data, You have to have permission (be logged in ) to see these data`. This mean that route is protected.

Now we have successfully set route protected by token with use of JWT
