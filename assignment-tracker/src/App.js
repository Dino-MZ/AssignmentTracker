import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard.js';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div>
      {username ? (
        <Dashboard username={username} />
      ) : (
        <LoginScreen onLogin={setUsername} />
      )}
    </div>
  );
}

export default App;