const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Int32 } = require("mongodb");
let alert = require('alert'); 
const path = require("path")

const app = express();
const port = 8000;
mongoose.set("strictQuery", false);
// Connect to the MongoDB database
const url = "mongodb://127.0.0.1:27017/userDB";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err)
);


const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("users", userSchema, "user");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));


app.get("/",(_req,res)=>{
 res.sendFile(__dirname+"/views/home.html");
 
})


app.get("/login", (_req, res) => {
 // res.sendFile(path.join(__dirname, '/views', 'loginRegisterPage.html'));
  res.sendFile(__dirname+"/views/loginRegisterPage.html");
});
app.get("/index", (_req, res) => {
res.sendFile(__dirname+"/views/index.html");
});


app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username, password: password}, function(err, result) {
    if (err) throw err;
    if (result) {
      //res.redirect("/index");
      res.sendFile(__dirname + "/views/" + "index.html");
      alert('User logged '+username+' !');
    } else {
      res.redirect('/login');
      alert('Invalid username or password');
    }
  });
});


app.get("/register", (_req, res) => {
  res.sendFile(__dirname + "/views/loginRegisterPage.html");
});


app.post("/register", (req, res) => {
  const username2 = req.body.username2;
  const email = req.body.email;
  const password2 = req.body.password2;
  User.findOne({$or:[{username:username2},{email:email}]}, function(err, result) {
    if (err) throw err;
    if (result) {
      res.redirect('/login');
      alert('User already present');
    } else {
      User.insertMany({username:username2, email:email, password:password2}, function(err, result) {
        if (err) throw err;
        
        res.redirect('/login');
        alert('New user inserted into database!');
      });
    }
  });
});


process.on("LOGIN", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
