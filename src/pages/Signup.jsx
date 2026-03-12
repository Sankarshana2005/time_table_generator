import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup(){

const [username,setUsername] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleSignup = async () => {

if(!username.trim() || !email.trim() || !password.trim()){
alert("All fields are required");
return;
}

/* strong password validation */
const strongPassword =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if(!strongPassword.test(password)){
alert(
"Password must contain:\n\n• Minimum 8 characters\n• 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character"
);
return;
}

try{

const res = await axios.post(
"http://localhost:5000/signup",
{
username: username.trim(),
email: email.trim(),
password: password
}
);

alert(res.data.message || "Signup successful");

navigate("/");

}catch(err){
console.log(err);
alert("Signup failed. Email may already exist.");
}

};

return(

<div style={{textAlign:"center",marginTop:"120px"}}>

<h2>User Signup</h2>

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