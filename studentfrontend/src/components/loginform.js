import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';  // Import Axios for API calls
import { useNavigate } from 'react-router-dom';  // For navigation after successful login

const LoginForm = () => {
  const [UserName, setusername] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate for redirection after login

  // Handle input changes
  const handleusernameChange = (e) => setusername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!UserName || !Password) {
      setError('Please fill in both fields');
      return;
    }

    // Reset error
    setError('');

    try {
      // API call to the backend for login validation using request parameters
      const response = await axios.get(`http://localhost:8080/login/getuser`, {
        params: {
          UserName,
          Password,
        },
      });
      console.log(UserName, Password);
      console.log(response.data)
      // If login is successful (e.g., backend returns status 200 or a token)
      if (response.data.userName===UserName) {
        const { token } = response.data;  // Assuming the token is returned
        localStorage.setItem('authToken', token);  // Store token in local storage (or session storage)
        localStorage.setItem('role',response.data.roleName);
        console.log(UserName, Password);
        console.log(response.data)
        //console.log(response.data.roleName)
        console.log("Login successful");
        navigate('/show');  // Navigate to a protected route after successful login
      }
      else if(response.data===""){
        console.log("wrong credentials")
      }
    } catch (error) {
      // If the login fails (e.g., 401 Unauthorized), show an error message
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
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
        Login
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={UserName}
          onChange={handleusernameChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={Password}
          onChange={handlePasswordChange}
          required
        />

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}  // Add some spacing
          onClick={() => navigate('/signup')}  // Navigate to signup page
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
