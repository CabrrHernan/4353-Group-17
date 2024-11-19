import './App.css';
import Home from './Home';
import Menu from './Menu';
import EventManagementForm from './Forms pages/EventManagementForm';
import VolunteerMatchingForm from './Forms pages/VolunteerMatchingForm';
import VolunteerHistory from './VolunteerHistory';
import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile'; 
import Admin from './Admin';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [authState, setAuthState] = useState({ isLoggedIn: false, username: '', isAdmin: false });

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
      <AppContent authState={authState} setAuthState={setAuthState} />
    </Router>
  );
}

function AppContent({ authState, setAuthState }) {
  const location = useLocation();
  const hideMenuOnRoutes = ['/login', '/signup'];

  return (
    <div className="App">
      {!hideMenuOnRoutes.includes(location.pathname) && authState.isLoggedIn && (
        <Menu setAuthState={setAuthState} />
      )}
      <Routes>
        <Route path="/" element={authState.isLoggedIn ? <Home setAuthState={setAuthState} user = {authState.username}/> : <Navigate to="/login" />} />
        <Route path="/Volunteers" element={authState.isLoggedIn ? <VolunteerMatchingForm /> : <Navigate to="/login" />} />
        <Route path="/Events" element={authState.isLoggedIn ? <EventManagementForm /> : <Navigate to="/login" />} />
        <Route path="/Notifications" element={authState.isLoggedIn ? <h1>Notifications</h1> : <Navigate to="/login" />} />
        <Route path="/login" element={!authState.isLoggedIn ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={authState.isLoggedIn ? <Profile /> : <Navigate to="/login" />} /> 
        <Route path="/volunteer-history" element={authState.isLoggedIn ? <VolunteerHistory /> : <Navigate to="/login" />} />
        <Route path="/VolunteerHistory" element={authState.isLoggedIn ? <VolunteerHistory /> : <Navigate to="/login" />} />
        <Route path="/admin" element={authState.isLoggedIn && authState.isAdmin ? <Admin /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
