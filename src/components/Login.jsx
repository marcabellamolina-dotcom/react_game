// Login.jsx — formulari per entrar amb un compte ja existent

import { useState } from 'react';
import { loginUser } from '../utils/storage';

export default function Login({ navigate, onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (!trimmed || !password) {
      setError('Omple els dos camps');
      return;
    }

    const result = loginUser(trimmed, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuth(trimmed);
  };

  return (
    <div className="card">
      <h2>Inicia sessió</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nom d'usuari
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </label>
        <label>
          Contrasenya
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="primary">Entra</button>
        <p className="muted center">
          No tens compte?{' '}
          <a className="link" onClick={() => navigate('register')}>Registra't</a>
        </p>
      </form>
    </div>
  );
}
