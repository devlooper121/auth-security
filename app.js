const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const md5 = require("md5");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// setup app using express 
const app = express();
// set app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended:true}));
// set app to use ejs middleware 
app.set('view engine', 'ejs');

// set app to use public folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required: [true, "email is required"]
    },
    password:{
        type: String,
        required: [true, "password is also required"]
    }
});


const User = new mongoose.model("User", userSchema);


app.get("/", (req, res)=>{
    res.render("home")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.listen(3000, ()=>{
    console.log("Server is started at port 3000");
})

app.post("/register",(req, res)=>{
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(err=>{
            if(!err){
                res.render("secrets");
            }else{
                log(err);
            };
        });
    });

    
});

app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email:userName}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser!= null){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(!err){
                        if(result){
                            res.render("secrets");
                        }else{
                            res.send("wrong password");
                        }
                    }
                });
            }else{
                res.send("wrong user or password");
            }
        }
    })
})