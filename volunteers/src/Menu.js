import './Menu.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Menu = ({ authState, setAuthState }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authState');
    setAuthState({ isLoggedIn: false, username: '', isAdmin: false });
    navigate('/login');
  };
  
  const username = authState.username || "Guest";
  const isAdmin = authState.isAdmin || false;

  return (
    <nav className="menu">
      <h1>Welcome, {username}</h1>

      <h2 className="menu-item" onClick={() => navigate('/')}>Home</h2>

      <h2 className="menu-item" onClick={() => navigate('/Volunteer Matching Form')}>Volunteer Matching</h2>
      <h2 className="menu-item" onClick={() => navigate('/Event Management Form')}>Event Management</h2>
      <h2 className="menu-item" onClick={() => navigate('/Reports')}>Reports</h2>
      {isAdmin && (
        <>
          
          <h2 className="menu-item" onClick={() => navigate('/volunteer-history')}>Volunteer History</h2>
         
        </>
      )}

      <h2 className="menu-item" onClick={handleLogout}>Log Out</h2>
    </nav>
  );
};

export default Menu;
