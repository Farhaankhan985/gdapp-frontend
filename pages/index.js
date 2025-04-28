import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === null) {
        // Create
        const res = await axios.post('http://localhost:5000/api/users', { name, email });
        setUsers([...users, { id: res.data.userId, name, email }]);
      } else {
        // Update
        await axios.put(`http://localhost:5000/api/users/${editId}`, { name, email });
        setUsers(users.map((user) => (user.id === editId ? { ...user, name, email } : user)));
        setEditId(null);
      }
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        input {
          padding: 10px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-top: 4px;
        }

        label {
          font-weight: 500;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #0070f3;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        tr:hover {
          background-color: #f1f1f1;
        }

        button {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s ease;
        }

        button:hover {
          background-color: #0059c1;
        }

        .action-btn {
          margin-right: 8px;
          padding: 6px 12px;
          font-size: 0.9rem;
        }

        .delete-btn {
          background-color: crimson;
        }

        .delete-btn:hover {
          background-color: darkred;
        }
      `}</style>

      <h1 style={styles.title}>User Management</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Enter user name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter user email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {editId === null ? '➕ Add User' : '✅ Update User'}
        </button>
      </form>

      <h2 style={styles.subtitle}>📋 User List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td style={{ color: '#0070f3' }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="action-btn" onClick={() => handleEdit(user)}>
                    ✏️ Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'gray' }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem',
    color: '#333',
  },
  subtitle: {
    marginTop: '40px',
    fontSize: '1.5rem',
    color: '#333',
  },
  form: {
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '15px',
  },
};
