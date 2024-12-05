import React, { useState } from 'react';
import { Button, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTaskForm = ({ addTask }) => {
  const [taskDetails, setTaskDetails] = useState({
    task: '',
    description: '',
    startdate: '',
    enddate: '',
    status: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input changes
  const handleChange = (e) => {
    setTaskDetails({
      ...taskDetails,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission and send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/board/add', taskDetails); // Replace with your API URL

      if (response.status === 201 || response.status === 200) {
        console.log("Task successfully added:", response.data);
        addTask(response.data);  // Add the new task to the frontend state
        navigate("/show");  // Redirect to the home page after successful submission
      } else {
        console.error("Error adding task:", response);
      }
    } catch (error) {
      console.error("Error while sending request:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/show");  // Redirect to home page
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '20px',
        bgcolor: 'background.paper',
        boxShadow: 2,
        borderRadius: 2
      }}
    >
      <h2>Add New Task</h2>
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={taskDetails.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        {/* Submit and Cancel Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Function to add a new task to the frontend state
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <AddTaskForm addTask={addTask} />
      {/* You can render the tasks or other components here */}
    </div>
  );
};

export default App;
