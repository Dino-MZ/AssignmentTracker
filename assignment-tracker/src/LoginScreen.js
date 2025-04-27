import React, { useState } from 'react';

function LoginScreen({ onLogin }) {
  const [inputUsername, setInputUsername] = useState('');

  const handleLogin = () => {
    if (inputUsername.trim() !== '') {
      onLogin(inputUsername);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginScreen;