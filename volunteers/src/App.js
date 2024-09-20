import './App.css';
import Home from './Home';
import Menu from './Menu';
import Login from './Login';
import SignUp from './SignUp';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const [authState, setAuthState] = useState({ isLoggedIn: false, username: '' });

  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      setAuthState(JSON.parse(storedAuthState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);

  return (
    <Router>
      <div className="App">
        {authState.isLoggedIn && <Menu setAuthState={setAuthState} />}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Profile" element={authState.isLoggedIn ? <h1>Profile</h1> : <Navigate to="/login" />} />
          <Route path="/Events" element={authState.isLoggedIn ? <h1>Events</h1> : <Navigate to="/login" />} />
          <Route path="/Notifications" element={authState.isLoggedIn ? <h1>Notifications</h1> : <Navigate to="/login" />} />
          <Route path="/login" element={!authState.isLoggedIn ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
          <Route path="/Volunteer Matching Form" element={authState.isLoggedIn ? <h1>Matching </h1> : <Navigate to="/login" />} />
          <Route path="/Event Managemnt Form" element={authState.isLoggedIn ? <h1>Event Managemnt </h1> : <Navigate to="/login" />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
