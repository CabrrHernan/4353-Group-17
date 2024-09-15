import './App.css';
import Menu from './Menu';
import Login from './Login';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [authState, setAuthState] = useState({ isLoggedIn: false, username: '' });

  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    console.log('localStorage authState:', storedAuthState);
    if (storedAuthState) {
      setAuthState(JSON.parse(storedAuthState));
    }
  }, []);

  useEffect(() => {
    console.log('authState:', authState);
  }, [authState]);

  return (
    <Router>
      <div className="App">
        {authState.isLoggedIn && <Menu />}
        <Routes>
          <Route path="/" element={authState.isLoggedIn ? <h1>Home</h1> : <Navigate to="/login" />} />
          <Route path="/Profile" element={authState.isLoggedIn ? <h1>Profile</h1> : <Navigate to="/login" />} />
          <Route path="/Events" element={authState.isLoggedIn ? <h1>Events</h1> : <Navigate to="/login" />} />
          <Route path="/Notifications" element={authState.isLoggedIn ? <h1>Notifications</h1> : <Navigate to="/login" />} />
          <Route path="/login" element={!authState.isLoggedIn ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
