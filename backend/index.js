const express = require("express");
const data = require("./data");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); // creates a instance of express. APp is used to handle requests and responses, routing, server configuration.
const port = 3000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const movieRoutes = require("./routes/movieRoutes");
// this is a route handler. It is a function that is executed when a request is made to the specified path.

// MODELS FOLDER= > DEFINE THE DATABSE SCHEMA

// CONTROLLERS = > CONTAINS THE LOGIC FOR THE ROUTES

// ROUTES => CONTAINS THE ROUTES AND CONNECT THEM TO APPROPRIATE CONTROLLER FUNCTIONS.

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // console.log(req);
  res.send("Please switch to /api/data to get the data");
});

// Routes are defined using app.get() method. It takes two arguments, the path and the route handler.
// app.get("/users", (req, res) => {
//   res.send(data);
// });

// get request for a specific user

// app.get("/users/:id", (req, res) => {
//   // this :id is a route parameter. It is a placeholder for the actual value that will be passed in the request. Dynamic route
//   const id = req.params.id; // this is how you access the route parameter in express.
//   console.log(id);
//   const user = data.find((user) => user.id == id); // find the user with the specified id.
//   console.log(user);
//   res.status(200).send(user); // send the user as response.
// });

app.get("/users/:userName", (req, res) => {
  // this :id is a route parameter. It is a placeholder for the actual value that will be passed in the request. Dynamic route
  const userName = req.params.userName; // this is how you access the route parameter in express.
  console.log(userName, "user   name");
  const user = data.find((user) => user.first_name === userName); // find the user with the specified id.
  console.log(user, " user");
  res.status(200).send(user); // send the user as response.
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  // const id = data.length;
  // console.log(id);

  const modififiedUser = { ...newUser, id: data.length + 1 };
  console.log(modififiedUser);
  data.push(modififiedUser);
  res.status(201).send(modififiedUser);
});

app.put("/users/:userId", (req, res) => {
  const id = req.params.userId; // Get the user ID from the route parameter
  const updatedUser = req.body; // Get the updated data from the request body

  const userIndex = data.findIndex((user) => user.id == id); // Find the index of the user in the data array
  if (userIndex !== -1) {
    data[userIndex] = { ...data[userIndex], ...updatedUser }; // Update the user data
    //
    //     id: 1,
    //     email: "george.bluth@reqres.in",
    //     first_name: "George",
    //     last_name: "Bluth",
    //     avatar: "https://reqres.in/img/faces/1-image.jpg",
    //    "email": "asdasdasdasth@reqres.in",
    // "first_name": "Shivasnhj",
    // "last_name": "Shivansh",
    // "avatar": "https://reqres.in/img/faces/1-image.jpg"

    res.status(200).send(data[userIndex]); // Send the updated user as a response
  } else {
    res.status(404).send({ message: "User not found" }); // If user not found, send 404
  }
});

app.delete("/users/:userId", (req, res) => {
  const id = req.params.userId; // Get the user ID from the route parameter

  const userIndex = data.findIndex((user) => user.id == id); // Find the index of the user in the data array

  // if id = 2 to user index will be 1 it will be -1 if only the user is not present in the data array else it will be the index of the user in the data array

  if (userIndex !== -1) {
    const deletedUser = data.splice(userIndex, 1); // Remove the user from the array
    res.status(200).send(deletedUser); // Send the deleted user as a response
  } else {
    res.status(404).send({ message: "User not found" }); // If user not found, send 404
  }
});

// MONGO DB STARTS HERE

//MONGOOSE => It is a library that helps to connect to the MongoDB database and perform operations on the database. (ODM => Object Data Modelling)

//SCHEMA => It is a blueprint of the database. It defines the structure of the database.

// MODEL => It is a constructor function that takes the schema and creates an instance of the document. It represents the collection in the database.

mongoose
  .connect(
    "mongodb+srv://rwtshivay:rwtshivay@cluster0.d7a1m.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true, // to avoid deprecated warning
      useUnifiedTopology: true, // enable new connection management engine
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

//SCHEMA => It is a blueprint of the database. It defines the structure of the database.

// getting everything

// IT IS A PAGINATION API
// IT IS USED TO FETCH THE DATA FROM THE DATABASE IN PAGINATION MANNER

// const moviesSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId, // mongo db will automatically create an id for the document. // object id is a data type in mongodb that is used to store the unique identifier of the document.
//   title: String,
//   director: String,
//   genre: [String],
//   year: Number,
// });

// const Movies = mongoose.model("Movies", moviesSchema)

app.use("/",authenticateToken, movieRoutes);

//

const users = [
  {
    email: "shivansh@`12.gmail.com",
    password: "$2b$12$roRzB6C0D.lg1Afs8haZ/eW1y/c8nFnTDYT0FPvVrPqjao26IFw5u",
  },
  {
    email: "shivansh@`12.gmail.com",
    password: "$2b$12$0gHfSl8i0FM1ovm0f8pVXOH6TH.CrSdTXkbM4Jo.L3IlQZcfQ5TFO",
  },
  {
    email: "shivansh@`13.gmail.com",
    password: "$2b$12$RG7BpTqd4mg7tFILjCb9d.HHYi/MMLkWiuhbZcm5ick.TKba/gVKm",
  },
];

const secretKey = "mysecretkey";

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12); // 12 is the number of rounds of hashing that will be applied to the password.

  users.push({
    email: email,
    password: hashedPassword,
  });

  res.status(200).send(users);
});

// LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body; // extract the email and password from the request body

  const user = users.find((user) => user.email === email); // find the user with the specified email

  if (!user) {
    return res.status(404).send("User not found"); // if user not found, send 404
  }

  const isValidPassword = bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).send("Invalid password");
  }
  const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" }); // create a JWT token with the user email and secret key. It will expire in 1 hour.
  res.status(200).json({
    token: token,
    message: "Login successful",
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  if (token == null) return res.sendStatus(401); // throw unauthorized error if token is not present

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // throw forbidden error if token is invalid
    req.user = user;
    next(); // this passes the control to the next middleware or route handler
  });

}

app.get("/users", authenticateToken, (req, res) => {
  res.send(data);
});

//JWT=> JSON WEB TOKEN, It stores informatioj encoded as a JSON object. It is used to authenticate users and maintain a session.

// IT IS COMPOSED OF THREE PARTS.

// 1. HEADER => It contains the type of token and the hashing algorithm used to generate the signature.
// 2. PAYLOAD => It contains the claims. Claims are statements about an entity (typically, the user) and additional data
//3. SIGNATURE => It is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.

//how jwt works // AUTHENTICATION FLOW

// 1. user authentication= > user login => server verifies the user credentials => server generates a JWT and sends it to the user.

//2. Store jwt in client side => client stores the JWT in local storage or session storage.

// 3. Send jwt in the header => client sends the JWT in the header of the request to the server.

// 4. Verify jwt => server verifies the JWT and sends the response.

// ADVANTAGES OF JWT .

//1. Compact => JWT is compact and can be sent in the header of the request.

//2. Self-contained => JWT contains all the information needed to verify the user. (user email, user id , secret key)

//3 . Secure => JWT is signed using a secret key or public/private key pair. It ensures that the sender of the JWT is who it says it is.

//4. Stateless => JWT is stateless. It does not require the server to store the user session. It can be used to authenticate users across multiple services. (it is easier to scale the application)

// DISADVANTAGES OF JWT

// 1. JWT is vulnerable to CSRF attacks. (Cross Site Request Forgery) => It is a type of attack where the attacker tricks the user into performing an action on a website without their knowledge.

//token Size => JWT can be large in size if it contains a lot of information. It can increase the size of the request and response.

//3. JWT is not suitable for storing sensitive information. => JWT is encoded, not encrypted. It can be decoded by anyone who has access to the JWT.

// 4. JWT is not suitable for revoking access => Once the JWT is issued, it cannot be revoked. If the JWT is compromised, the attacker can access the user account until the JWT expires.

//EXAMPLE OF JWT => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

// MIDDLEWARES ARE THE FUNCTION THAT PROCESS THE REQUEST BEFORE IT REACHES THE ROUTE HANDLER. (BODYPARSER, CORS, AUTHENTICATION). THEY USE next() TO PASS THE CONTROL TO THE NEXT MIDDLEWARE OR ROUTE HANDLER.

// next()=> It is a function that is used to pass the control to the next middleware or route handler.

//THIS API I WANT CALL IF THE USER IS AUTHENTICATED

// start the server and listen on the port.
app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  // console.log(`Server is running on port`, data);
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZhbnNoQGAxMy5nbWFpbC5jb20iLCJpYXQiOjE3MjUxNjM0ODcsImV4cCI6MTcyNTE2NzA4N30.6M7E0O0qH8vimDVzofWDASG19nNkAhUgtTLclSySYBs
