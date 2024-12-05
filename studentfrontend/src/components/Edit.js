import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import the CloseIcon for the button
import axios from 'axios';  // Import axios for making HTTP requests
import { useParams, useNavigate } from 'react-router-dom';  // Import useParams to get the task ID from the URL

const Editform = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const [taskDetails, setTaskDetails] = useState({
    task: '',
    description: '',
    startdate: '',
    enddate: '',
    status: '',
  });
  const navigate = useNavigate();
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};
  
  const apiUrl = `http://localhost:8080/board`; // Base API URL

  // Fetch the task details when the component loads using the task ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        // Make the GET request to fetch the task details based on the ID from the URL
        const response = await axios.get(`${apiUrl}/${id}`);
        const taskData = response.data;

        // Update the taskDetails state with the fetched task data
        setTaskDetails({
          task: taskData.task,
          description: taskData.description,
          startdate: formatDate(taskData.startdate),
          enddate: formatDate(taskData.enddate),
          status: taskData.status,
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id, apiUrl]); // Fetch data whenever the ID changes

  // Handle input changes
  const handleChange = (e) => {
    setTaskDetails({
      ...taskDetails,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission and send updated data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Call the backend API to update task details
      const response = await axios.put(`${apiUrl}/update/${id}`, taskDetails);

      if (response.status === 200) {
        console.log("Task successfully updated:", response.data);
        navigate("/show");  // Redirect to the main page after updating the task
      } else {
        console.error("Error updating task:", response);
      }
    } catch (error) {
      console.error("Error while sending request:", error);
    }
  };

  // Handle close button click
  const handleClose = () => {
    navigate("/");  // Navigate back to the home route
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          position: 'relative' // To position the close button absolutely
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" component="h2" gutterBottom>
          Edit Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Task Name"
            name="task"
            value={taskDetails.task}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={taskDetails.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Start Date"
            name="startdate"
            type="date"
            value={taskDetails.startdate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            name="enddate"
            type="date"
            value={taskDetails.enddate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
    
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Update
          </Button>
          
        </form>
      </Box>
    </div>
  );
};

export default Editform;
