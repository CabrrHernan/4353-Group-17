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
      <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
      <a href="/Profile/" onClick={(e) => { e.preventDefault(); navigate('/Profile'); }}>Profile</a>
      <a href="/Events/" onClick={(e) => { e.preventDefault(); navigate('/Events'); }}>Events</a>
      <a href="/Notifications/" onClick={(e) => { e.preventDefault(); navigate('/Notifications'); }}>Notifications</a>
      <a href="/login" onClick={(e) => {handleLogout();}}>Log Out</a>
    </nav>
  );
};
 
export default Menu;

