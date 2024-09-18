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
      let users = JSON.parse(localStorage.getItem('users')) || [];

      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
        const authState = { isLoggedIn: true, username };
        localStorage.setItem('authState', JSON.stringify(authState));
        setAuthState(authState);
        navigate('/');
      } else {
        alert('Invalid username or password.');
      }
    } else {
      alert('Please enter both a username and password.');
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
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
}

export default Login;