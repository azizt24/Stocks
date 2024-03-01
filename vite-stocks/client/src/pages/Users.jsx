import { useEffect, useState } from 'react';
import '../styles/Users.css';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-users");
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="all-users-page">
      <h2>All users</h2>
      <div className="all-users">
        {users.filter(user => user.usertype !== 'admin').map(user => (
          <div className="user" key={user._id}>
            <p><b>User id:</b> {user._id}</p>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Balance:</b> {user.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
