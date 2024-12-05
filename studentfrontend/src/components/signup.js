import React, { useState } from 'react';
import { TextField, Button, Box, Typography,Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';  // Import Axios for API calls
import { useNavigate } from 'react-router-dom';  // For navigation after successful signup

const SignUpForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [roleName, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate for redirection after signup

  // Handle input changes
  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!userName || !password || !roleName) {
      setError('Please fill in all fields');
      return;
    }

    // Reset error and success messages
    setError('');
    setSuccess('');

    try {
      // API call to the backend for user registration
      const response = await axios.post(`http://localhost:8080/login/adduser`, {
        userName,
        password,
        roleName,
      });

      // Check if signup is successful (modify according to your API response)
      if (response.status === 200) {
        setSuccess('Sign up successful!');  // Display success message
        navigate('/');  // Redirect to login page after successful signup
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        setError(error.response.data.message || 'Signup failed. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        margin: '100px auto',
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={userName}
          onChange={handleUserNameChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleName}
            onChange={handleRoleChange}
            label="Role"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}

        {/* Success Message */}
        {success && (
          <Typography color="success.main" variant="body2" gutterBottom>
            {success}
          </Typography>
        )}

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUpForm;
