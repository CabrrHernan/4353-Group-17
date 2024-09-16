import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (username && password) {
      // Get existing users from localStorage or create an empty array
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Check if the username already exists
      const userExists = users.some(user => user.username === username);

      if (userExists) {
        alert('Username already exists. Please choose another one.');
      } else {
        // Add new user to the array
        users.push({ username, password });
        // Store the updated user array in localStorage
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully. You can now log in.');
        navigate('/login'); // Redirect to login page after sign-up
      }
    } else {
      alert('Please enter both a username and password.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;