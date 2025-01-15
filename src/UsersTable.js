import React, { useState, useEffect } from "react";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isAddMode, setIsAddMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const updatedUser = { ...formData, id: editingUser };
    const { id, ...dataToSend } = updatedUser;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editingUser}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );
      const dataResJson = await response.json();
      console.log(dataResJson);
    } catch (err) {
      console.log(`Unable to update user: ${err}`);
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUser ? { ...user, ...updatedUser } : user
      )
    );
    setEditingUser(null);
    setFormData({ name: "", email: "" });
  };

  const handleAddUser = async () => {
    const newUser = { ...formData };
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setIsAddMode(false);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.log(`Unable to add user: ${err}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: "DELETE",
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.log(`Unable to delete user: ${err}`);
    }
  };

  return (
    <div>
      <h2>User Table</h2>

      <button onClick={() => setIsAddMode(true)}>Add New User</button>

      
      {isAddMode && (
        <div>
          <h3>Add New User</h3>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <br />
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <button onClick={handleAddUser}>Save New User</button>
          <button onClick={() => setIsAddMode(false)}>Cancel</button>
        </div>
      )}

      
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingUser === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUser === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUser === user.id ? (
                  <button onClick={handleUpdate}>Update</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <br />
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <button onClick={handleUpdate}>Save Changes</button>
        </div>
      )}
    </div>
  );
}

export default UsersTable;
