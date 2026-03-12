import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();

const handleLogin = async () => {

if(!email.trim() || !password.trim()){
alert("Email and Password cannot be empty");
return;
}

try{

const res = await axios.post(
"http://localhost:5000/login",
{email,password}
);

localStorage.setItem("token",res.data.token);

if(res.data.role === "admin"){
navigate("/admin");
}else{
navigate("/dashboard");
}

}catch(err){
console.log(err);
alert("Login failed");
}

};

return(

<div style={{textAlign:"center",marginTop:"120px"}}>
    <h1>Welcome to Time Table Generator</h1>

<h2>Login</h2>

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

<button onClick={handleLogin}>
Login
</button>

<br/><br/>

<p>
Don't have an account? 
<a href="/signup"> Signup</a>
</p>

</div>

);

}

export default Login;