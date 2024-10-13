import './App.css';
import Home from './Home';
import Menu from './Menu';
import EventManagementFrom from './Forms pages/EventManagementForm';
import VolunteerMatchingForm from './Forms pages/VolunteerMatchingForm';
import Login from './Login';
import SignUp from './SignUp';
<<<<<<< HEAD

=======
>>>>>>> 793a5d5734b44095dba7f4ef840fc927c31bae43
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [authState, setAuthState] = useState({ isLoggedIn: true, username: '' });

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
        <Route path="/" element={authState.isLoggedIn ? <Home setAuthState={setAuthState} /> : <Navigate to="/login" />} />
        <Route path="/Volunteers" element={authState.isLoggedIn ? <VolunteerMatchingForm /> : <Navigate to="/login" />} />
        <Route path="/Events" element={authState.isLoggedIn ? <EventManagementFrom /> : <Navigate to="/login" />} />
        <Route path="/Notifications" element={authState.isLoggedIn ? <h1>Notifications</h1> : <Navigate to="/login" />} />
        <Route path="/login" element={!authState.isLoggedIn ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
