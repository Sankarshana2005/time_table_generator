import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Panel</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, i) => (
            <tr key={i}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminPanel;