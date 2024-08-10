import React, { useState, useEffect } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const handleKeyCombination = (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      setShowLoginForm((prevShowLoginForm) => !prevShowLoginForm);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyCombination);
    return () => {
      window.removeEventListener('keydown', handleKeyCombination);
    };
  }, []);

  return (
    <>
      {showLoginForm && (
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
    </>
  );
}

export default Login;
