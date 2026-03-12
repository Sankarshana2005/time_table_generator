import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {

const [users,setUsers] = useState([]);
const [editId,setEditId] = useState(null);
const [editUsername,setEditUsername] = useState("");
const [editEmail,setEditEmail] = useState("");

useEffect(()=>{
fetchUsers();
},[]);

const fetchUsers = async () => {

try{
const res = await axios.get("http://localhost:5000/users");
setUsers(res.data);
}catch(err){
console.log(err);
}

};

const startEdit = (user) => {
setEditId(user._id);
setEditUsername(user.username);
setEditEmail(user.email);
};

const saveEdit = async () => {

try{

await axios.put(
`http://localhost:5000/users/${editId}`,
{
username:editUsername,
email:editEmail
}
);

setEditId(null);
fetchUsers();

}catch(err){
console.log(err);
}

};

const deleteUser = async (id) => {

if(!window.confirm("Delete this user?")) return;

try{

await axios.delete(`http://localhost:5000/users/${id}`);
fetchUsers();

}catch(err){
console.log(err);
}

};

return(

<div style={{padding:"40px"}}>

<h2>Admin Panel</h2>

<table border="1" cellPadding="10">

<thead>
<tr>
<th>Username</th>
<th>Email</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{users
.filter(user => user.username && user.email)
.map((user)=>(
<tr key={user._id}>

<td>
{editId === user._id ? (
<input
value={editUsername}
onChange={(e)=>setEditUsername(e.target.value)}
/>
) : (
user.username
)}
</td>

<td>
{editId === user._id ? (
<input
value={editEmail}
onChange={(e)=>setEditEmail(e.target.value)}
/>
) : (
user.email
)}
</td>

<td>

{editId === user._id ? (
<button onClick={saveEdit}>Save</button>
) : (
<button onClick={()=>startEdit(user)}>Edit</button>
)}

<button onClick={()=>deleteUser(user._id)}>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

);

}

export default AdminPanel;