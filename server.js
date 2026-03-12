const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const { buildTimetable } = require("./timetable");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- MongoDB Connection ---------- */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* ---------- User Model ---------- */

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

/* ---------- Signup ---------- */

app.post("/signup", async (req,res)=>{

const {username,email,password} = req.body;

try{

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
username,
email,
password:hashedPassword
});

await user.save();

res.json({message:"User Registered"});

}catch(err){
res.status(500).json({message:"Signup failed"});
}

});

/* ---------- Login ---------- */

app.post("/login", async (req,res)=>{

const {email,password} = req.body;

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

/* ---------- Admin Users ---------- */

app.get("/users", async (req,res)=>{
const users = await User.find();
res.json(users);
});

/* ---------- Update User ---------- */

app.put("/users/:id", async (req,res)=>{

const {username,email} = req.body;

await User.findByIdAndUpdate(
req.params.id,
{username,email}
);

res.json({message:"User updated"});

});

/* ---------- Delete User ---------- */

app.delete("/users/:id", async (req,res)=>{

await User.findByIdAndDelete(req.params.id);

res.json({message:"User deleted"});

});

/* ---------- Timetable API ---------- */

app.post("/generate",(req,res)=>{

const { subjects, days, slots } = req.body;

const matrix = buildTimetable(subjects, days, slots);

res.json({ matrix });

});

/* ---------- Serve React Build ---------- */

app.use(express.static(path.join(__dirname,"client/dist")));

app.get("/*",(req,res)=>{
res.sendFile(path.join(__dirname,"client/dist/index.html"));
});

/* ---------- Start Server ---------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});