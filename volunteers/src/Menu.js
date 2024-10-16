import './Menu.css';
import { useNavigate } from 'react-router-dom';

const Menu = ({ setAuthState }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authState');
    setAuthState({ isLoggedIn: false, username: '' });
    navigate('/login');
  };

  return (
    <nav className="menu">
      <h1>Welcome, Volunteer</h1>

      <h2 className="menu-item" onClick={() => navigate('/')}>Home</h2>
      <h2 className="menu-item" onClick={() => navigate('/Volunteers')}>Volunteers</h2>
      <h2 className="menu-item" onClick={() => navigate('/Events')}>Events</h2>
      <h2 className="menu-item" onClick={() => navigate('/Notifications')}>Notifications</h2>
      <h2 className="menu-item" onClick={() => navigate('/Volunteer Matching Form')}>Matching</h2>
      <h2 className="menu-item" onClick={() => navigate('/Event Management Form')}>Event Management</h2>
      <h2 className="menu-item" onClick={() => navigate('/volunteer-history')}>Volunteer History</h2> {/* Added Volunteer History */}
      <h2 className="menu-item" onClick={handleLogout}>Log Out</h2>
    </nav>
  );
};

export default Menu;
