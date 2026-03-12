import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup(){

const [username,setUsername]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();

const handleSignup = async () => {

if(!username.trim() || !email.trim() || !password.trim()){
alert("All fields are required");
return;
}

try{

await axios.post("http://localhost:5000/signup",{
username,
email,
password
});

alert("Signup Successful. Please Login.");

navigate("/");

}catch(err){
console.log(err);
alert("Signup failed");
}

};

return(

<div style={{textAlign:"center",marginTop:"120px"}}>

<h2>Signup</h2>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<br/><br/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button onClick={handleSignup}>
Signup
</button>

<br/><br/>

<p>
Already have an account? 
<a href="/"> Login</a>
</p>

</div>

);

}

export default Signup;