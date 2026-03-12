import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleAdminLogin = () => {

const adminEmail = "admin@timetable.com";
const adminPassword = "Admin@123";

if(!email.trim() || !password.trim()){
alert("Please enter email and password");
return;
}

if(email === adminEmail && password === adminPassword){

localStorage.setItem("adminAuth","true");

alert("Admin login successful");

navigate("/admin/dashboard");

}else{

alert("Invalid admin credentials");

}

};

return(

<div style={{textAlign:"center",marginTop:"120px"}}>

<h2>Admin Login</h2>

<input
type="email"
placeholder="Admin Email"
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

<button onClick={handleAdminLogin}>
Login
</button>

<br/><br/>

<p>
User Login? 
<a href="/"> Go to Login</a>
</p>

</div>

);

}

export default AdminLogin;