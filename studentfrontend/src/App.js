
import './App.css';
import AppBar from './components/appbar'
import Tasks from './components/popform';
import Edit from './components/Edit';
import Showcard from './components/showcard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/loginform'
import { Navigate } from 'react-router-dom';
import Signup from './components/signup'




function App() {

  const PrivateRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem('authToken');  // Check for authentication token in localStorage
    console.log(localStorage.getItem('authToken'))
    
    return isAuthenticated ? Component : <Navigate to="/login" />;  // If authenticated, render the component; otherwise, redirect to login
  };
  
  return (
    <Router>
      <AppBar />
    <Routes>
      {/* Define the routes */}
      
      <Route path="/show" element={<Showcard/>} />
      <Route path="/add-task" element={<PrivateRoute element={<Tasks />} />} />
        <Route path="/edit/:id" element={<PrivateRoute element={<Edit />} />} />
      <Route path='/' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>

    </Routes>
    
  </Router>
    
  );
}

export default App;
