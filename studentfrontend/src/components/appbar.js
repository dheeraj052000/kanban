import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // User icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Header = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const isAuthenticated = localStorage.getItem('authToken');
  const role=localStorage.getItem('role')

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Clear the authentication token
    navigate('/');  // Redirect to the login page after logout
  };

  // Function to handle navigation to profile or other pages
  const handleProfileClick = () => {
    navigate('/profile');  // Replace with actual route if needed
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Kanban Board
      </Typography>
    

        {isAuthenticated ? (
      <>
        <div>
        {(() => {
          if (role === "admin") {
            return <h1 style={{ fontSize: "12px" }}>Welcome, Admin!</h1>;
          } else {
            return <h1 style={{ fontSize: "12px" }}>Welcome, User!</h1>;
          }
        })()}
      </div>
        {/* Check if the role is admin */}
        {role === "admin" && (
          <Button color="inherit" onClick={() => navigate('/add-task')}>
            ADD TASK
          </Button>
        )}
        
        <IconButton color="inherit" onClick={handleProfileClick}>
          <AccountCircleIcon />
        </IconButton>

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </>
    ) : (
      <Button color="inherit" onClick={() => navigate('/')}>
        Login
      </Button>
    )}

    </Toolbar>
  </AppBar>
  );
};

export default Header;
