import './App.css';
import Home from './Home';
import Menu from './Menu';
import EventManagementForm from './Formspages/EventManagementForm';
import VolunteerMatchingForm from './Formspages/VolunteerMatchingForm';
import VolunteerHistory from './VolunteerHistory';
import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile'; 
import Admin from './Admin';
import Report from './Formspages/Reports';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [authState, setAuthState] = useState({'isLoggedIn':false});
  
  useEffect(() => {
    
    console.log(authState) //debugger
    if (authState.isLoggedIn) {
        localStorage.setItem('username',authState.username);
        localStorage.setItem('id',authState.id);
        localStorage.setItem('is_admin', authState.is_admin);
        localStorage.setItem('isLoggedIn', authState.isLoggedIn);
    }
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
  console.log("app content", authState); //debug
  return (
    <div className="App">
      {!hideMenuOnRoutes.includes(location.pathname) && authState.isLoggedIn && (
        <Menu setAuthState={setAuthState} authState={authState} />
      )}
      <Routes>
      <Route path="/" element={authState.isLoggedIn ? <Home authState = {authState} /> : <Navigate to="/login" />} />
      <Route path="/Volunteer Matching Form" element={authState.isLoggedIn  ? <VolunteerMatchingForm /> : <Navigate to="/" />} />
      <Route path="/Event Management Form" element={authState.isLoggedIn  ? <EventManagementForm /> : <Navigate to="/" />} />
      <Route path="/Notifications" element={authState.isLoggedIn ? <h1>Notifications</h1> : <Navigate to="/login" />} />
      <Route path="/login" element={!authState.isLoggedIn ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={authState.isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/volunteer-history" element={authState.isLoggedIn ? <VolunteerHistory /> : <Navigate to="/login" />} />
      <Route path="/Reports" element={authState.isLoggedIn  ? <Report /> : <Navigate to="/" />} />
      <Route path="/admin" element={authState.isLoggedIn && authState.isAdmin ? <Admin /> : <Navigate to="/" />} />
    </Routes>

    </div>
  );
}

export default App;
