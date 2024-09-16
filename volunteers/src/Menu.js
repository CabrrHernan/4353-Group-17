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
      <h1>Volunteers</h1>
      <a onClick={() => navigate('/')}>Home</a>
      <a onClick={() => navigate('/Profile')}>Profile</a>
      <a onClick={() => navigate('/Events')}>Events</a>
      <a onClick={() => navigate('/Notifications')}>Notifications</a>
      <a onClick={handleLogout}>Log Out</a>
    </nav>
  );
};
 
export default Menu;

