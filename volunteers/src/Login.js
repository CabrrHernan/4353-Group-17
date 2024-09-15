import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({setAuthState}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      console.log('Logging in...');
      const authState = { isLoggedIn: true, username };
      localStorage.setItem('authState', JSON.stringify(authState));
      console.log('localStorage authState after set:', localStorage.getItem('authState'));
      setAuthState(authState);
      navigate('/');
    } else {
      alert('Please enter a username and password');
    }
  };

return (
  <div className="login-container">
    <h1>Login</h1>
    <form className="login-form" onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
);
}

export default Login;