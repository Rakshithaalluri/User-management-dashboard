import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, AlertCircle } from 'lucide-react';
 // Update to a single import
 import './App.css';



 const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const initialFormState = {
    id: '',
    name: '',
    email: '',
    department: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.map(user => ({
        ...user,
        department: ['HR', 'Engineering', 'Sales', 'Marketing'][Math.floor(Math.random() * 4)]
      })));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${formData.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to update user');
        
        setUsers(users.map(user => 
          user.id === formData.id ? formData : user
        ));
      } else {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to add user');
        
        const newUser = { ...formData, id: users.length + 1 };
        setUsers([...users, newUser]);
      }
      
      setShowForm(false);
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">User Management System</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormData(initialFormState);
          }}
          className="add-user-btn"
        >
          <PlusCircle className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="alert">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h2 className="form-header">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
              {formErrors.name && (
                <p className="error-text">{formErrors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
              {formErrors.email && (
                <p className="error-text">{formErrors.email}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
              />
              {formErrors.department && (
                <p className="error-text">{formErrors.department}</p>
              )}
            </div>
            <div className="button-group">
              <button type="submit" className="button-submit">
                {isEditing ? 'Update User' : 'Add User'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="button-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Department</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell">{user.name}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">{user.department}</td>
                    <td className="table-cell table-cell-actions">
                      <button onClick={() => handleEdit(user)} className="text-blue-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="pagination-btn"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="pagination-btn"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;