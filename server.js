const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { buildTimetable } = require("./timetable");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/timetableDB")
.then(()=>console.log("MongoDB Connected"));

const UserSchema = new mongoose.Schema({
username:String,
email:String,
password:String,
role:{
type:String,
default:"user"
}
});

const User = mongoose.model("User",UserSchema);

app.post("/signup",async(req,res)=>{

const {username,email,password}=req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
username,
email,
password:hashedPassword
});

await user.save();

res.json({message:"User Registered"});
});

app.post("/login",async(req,res)=>{

const {email,password}=req.body;

const user = await User.findOne({email});

if(!user){
return res.json({message:"User not found"});
}

const match = await bcrypt.compare(password,user.password);

if(!match){
return res.json({message:"Wrong password"});
}

const token = jwt.sign({id:user._id},"secretkey");

res.json({
token,
role:user.role
});

});

app.get("/users",async(req,res)=>{
const users = await User.find();
res.json(users);
});

app.post("/generate",(req,res)=>{

const { subjects, days, slots } = req.body;

const matrix = buildTimetable(subjects, days, slots);

res.json({ matrix });

});

app.listen(5000,()=>{
console.log("Server running on port 5000");
});